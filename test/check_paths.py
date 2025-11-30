import os
import re
import sys

# Configuration
IGNORE_DIRS = {'.git', 'node_modules', '__pycache__',
               'venv', '.vscode', '.idea', 'limpieza'}
IGNORE_FILES = {'package-lock.json', 'check_paths.py', 'requirements.txt'}

# Regex Patterns
# Matches absolute paths starting with / followed by static or pages
# This should detect hardcoded absolute paths in src/href attributes, not in JS pathname checks
ABSOLUTE_PATH_REGEX = re.compile(r'(?:src|href)=["\'][/](static|pages)/')

# Matches hardcoded static paths in JS (e.g., "static/", 'static/')
# We want to avoid matching things like `${staticPath}/static/`
# So we look for quotes immediately followed by static/
JS_HARDCODED_STATIC_REGEX = re.compile(r'["\'](static/[^"\']*)["\']')

# HTML src/href checks are context dependent (root vs subdir)
HTML_ATTR_REGEX = re.compile(r'(src|href)=["\']([^"\']+)["\']')


def check_file(filepath, root_dir):
    rel_path = os.path.relpath(filepath, root_dir)
    filename = os.path.basename(filepath)

    if filename in IGNORE_FILES:
        return []

    issues = []

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            lines = content.splitlines()
    except UnicodeDecodeError:
        return []  # Skip binary files

    # 1. Global Check: Absolute Paths
    for i, line in enumerate(lines):
        if ABSOLUTE_PATH_REGEX.search(line):
            # Filter out some common false positives if necessary
            issues.append({
                'line': i + 1,
                'msg': f"Found absolute path starting with '/': {line.strip()}",
                'type': 'Error'
            })

    # 2. JS Checks
    if filename.endswith('.js'):
        for i, line in enumerate(lines):
            # Check for hardcoded "static/" strings which might break if script is run from subdir
            # But we must be careful not to flag imports or specific valid uses.
            # A common pattern to enforce is using getStaticPath()

            # Skip comments
            if line.strip().startswith('//') or line.strip().startswith('*') or line.strip().startswith('/*'):
                continue

            matches = JS_HARDCODED_STATIC_REGEX.findall(line)
            for match in matches:
                # Heuristic: if it's inside a fetch or assignment, it's suspicious
                # We ignore imports because they are usually relative to the file
                if 'import ' in line:
                    continue

                # Ignore if it's part of a template literal with variable interpolation
                if '${' in line and '}' in line:
                    continue

                if 'fetch' in line or 'src' in line or 'href' in line or 'url' in line:
                    issues.append({
                        'line': i + 1,
                        'msg': f"Potential hardcoded static path in JS: '{match}'. Consider using getStaticPath().",
                        'type': 'Warning'
                    })

    # 3. HTML Checks
    if filename.endswith('.html'):
        # Determine if file is in a subdirectory (like pages/)
        # os.path.dirname('index.html') is '' (root)
        # os.path.dirname('pages/foo.html') is 'pages' (subdir)
        dir_name = os.path.dirname(rel_path)
        is_in_subdir = dir_name != '' and dir_name != '.'

        for i, line in enumerate(lines):
            matches = HTML_ATTR_REGEX.findall(line)
            for _, value in matches:
                # Ignore external links, anchors, data uris
                if value.startswith(('http', '#', 'data:', 'mailto:', 'javascript:')):
                    continue

                if is_in_subdir:
                    # In subdir (e.g. pages/), links to static/ should start with ../
                    if value.startswith('static/'):
                        issues.append({
                            'line': i + 1,
                            'msg': f"HTML in subdir '{dir_name}' references 'static/' directly: '{value}'. Should likely be '../static/'.",
                            'type': 'Error'
                        })
                else:
                    # In root, links to static/ should NOT start with ../
                    if value.startswith('../static/'):
                        issues.append({
                            'line': i + 1,
                            'msg': f"HTML in root references '../static/': '{value}'. Should be 'static/'.",
                            'type': 'Error'
                        })

    return issues


def main():
    root_dir = os.getcwd()
    all_issues = {}
    has_errors = False

    print(f"🔍 Scanning for path issues in: {root_dir}\n")

    for root, dirs, files in os.walk(root_dir):
        # Filter directories
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

        for file in files:
            filepath = os.path.join(root, file)
            issues = check_file(filepath, root_dir)

            if issues:
                rel_path = os.path.relpath(filepath, root_dir)
                all_issues[rel_path] = issues
                for issue in issues:
                    if issue['type'] == 'Error':
                        has_errors = True

    # Report
    if not all_issues:
        print("✅ No path issues found. Project looks good for GitHub Pages!")
    else:
        for filepath, issues in all_issues.items():
            print(f"📄 {filepath}:")
            for issue in issues:
                icon = "❌" if issue['type'] == 'Error' else "⚠️"
                print(f"  {icon} Line {issue['line']}: {issue['msg']}")
            print("")

        if has_errors:
            print("❌ Errors found. Please fix them before pushing.")
            sys.exit(1)
        else:
            print("⚠️ Warnings found, but no critical errors.")


if __name__ == "__main__":
    main()
