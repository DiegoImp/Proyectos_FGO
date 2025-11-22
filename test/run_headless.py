import sys
import os
import threading
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Configuration
PORT = 8001
# Set root to project root (one level up from this script)
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):  # pylint: disable=redefined-builtin
        pass


class SilentHTTPServer(HTTPServer):
    def handle_error(self, request, client_address):
        """Suppress socket errors during shutdown."""
        pass


def start_server():
    """Starts a simple HTTP server to serve the project files."""
    try:
        os.chdir(ROOT_DIR)
        httpd = SilentHTTPServer(('localhost', PORT), QuietHandler)
        httpd.serve_forever()
    except Exception as e:  # pylint: disable=broad-except
        print(f"Server error: {e}")


def run_tests():
    print(f"📂 Project Root: {ROOT_DIR}")

    # Start server in thread
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()

    # Give server a moment to start
    time.sleep(1)

    # Setup Headless Chrome
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--log-level=3")  # Suppress logs
    chrome_options.add_argument("--disable-gpu")

    print("🚀 Starting headless browser test runner...")
    print("   (This may take a moment to download the driver on first run)")

    driver = None
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)

        url = f"http://localhost:{PORT}/test/unit/index.html"
        driver.get(url)

        # Wait for tests to finish (look for the duration text in the stats)
        # Mocha adds 'duration' class to a list item when done
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "ul#mocha-stats li.duration"))
        )

        # Extract results
        passes = driver.find_elements(By.CSS_SELECTOR, "li.test.pass")
        failures = driver.find_elements(By.CSS_SELECTOR, "li.test.fail")

        print("\n" + "="*60)
        print("   TEST RESULTS (Headless Chrome)")
        print("="*60 + "\n")

        if len(passes) > 0:
            print(f"✅ PASSING ({len(passes)}):")
            for p in passes:
                title = p.find_element(By.TAG_NAME, "h2").text
                # Clean up the title (remove the 'replay' link text if captured)
                print(f"  • {title}")
            print("")

        if len(failures) > 0:
            print(f"❌ FAILURES ({len(failures)}):")
            for f in failures:
                title = f.find_element(By.TAG_NAME, "h2").text
                error = f.find_element(By.TAG_NAME, "pre").text
                print(f"  • {title}")
                print(f"    {error}\n")

        print("-" * 60)
        print(
            f"SUMMARY: Total: {len(passes) + len(failures)} | Passed: {len(passes)} | Failed: {len(failures)}")
        print("-" * 60)

        if len(failures) > 0:
            sys.exit(1)
        else:
            sys.exit(0)

    except Exception as e:  # pylint: disable=broad-except
        print(f"\n❌ Error running tests: {e}")
        print("Ensure you have Google Chrome installed.")
        sys.exit(1)
    finally:
        if driver:
            driver.quit()


if __name__ == "__main__":
    run_tests()
