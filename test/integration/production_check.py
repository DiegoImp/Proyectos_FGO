import os
import sys

# Configuration
PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '../../'))
REQUIRED_FILES = [
    'index.html',
    'static/main.js',
    'static/css/reset.css',
    'static/css/variables.css',
    'static/js/services/auth.js',
    'static/js/services/data.js',
    'static/js/ui/cards.js',
    'static/js/utils/routing.js'
]

REQUIRED_VARIABLES = [
    '--color-gold',
    '--color-dark-blue',
    '--np-arts'
]


def check_files_exist():
    print("🔍 Checking critical files...")
    missing_files = []
    for file_path in REQUIRED_FILES:
        full_path = os.path.join(PROJECT_ROOT, file_path)
        if not os.path.exists(full_path):
            missing_files.append(file_path)
            print(f"❌ Missing: {file_path}")
        else:
            print(f"✅ Found: {file_path}")

    if missing_files:
        return False
    return True


def check_css_variables():
    print("\n🎨 Checking CSS variables...")
    variables_css_path = os.path.join(PROJECT_ROOT, 'static/css/variables.css')

    try:
        with open(variables_css_path, 'r', encoding='utf-8') as f:
            content = f.read()

        missing_vars = []
        for var in REQUIRED_VARIABLES:
            if var not in content:
                missing_vars.append(var)
                print(f"❌ Missing variable: {var}")
            else:
                print(f"✅ Found variable: {var}")

        if missing_vars:
            return False
        return True
    except OSError as e:
        print(f"❌ Error reading variables.css: {e}")
        return False


def check_index_html_integrity():
    print("\n📄 Checking index.html integrity...")
    index_path = os.path.join(PROJECT_ROOT, 'index.html')

    try:
        with open(index_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check for module type script
        if 'type="module" src="./static/main.js"' in content:
            print("✅ Main script linked correctly (module)")
        else:
            print("❌ Main script link missing or incorrect")
            return False

        # Check for CSS links
        if 'href="static/css/variables.css"' in content:
            print("✅ Variables CSS linked")
        else:
            print("❌ Variables CSS link missing")
            return False

        return True
    except OSError as e:
        print(f"❌ Error reading index.html: {e}")
        return False


def main():
    print(f"🚀 Starting Production Check for: {PROJECT_ROOT}\n")

    checks = [
        check_files_exist(),
        check_css_variables(),
        check_index_html_integrity()
    ]

    if all(checks):
        print("\n✨ ALL CHECKS PASSED! Ready for production/commit.")
        sys.exit(0)
    else:
        print("\n⚠️ SOME CHECKS FAILED. Please review errors.")
        sys.exit(1)


if __name__ == "__main__":
    main()
