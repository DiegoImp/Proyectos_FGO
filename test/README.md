# FGO Dashboard Testing Suite

This directory contains tests to ensure the stability and quality of the FGO Dashboard project.

## Structure

- **unit/**: JavaScript unit tests running in the browser.
- **integration/**: Python scripts to verify file integrity and production readiness.

## How to Run Tests

### 1. Unit Tests (JavaScript)

These tests verify the logic of individual functions (e.g., formatting, card logic).

**Option A: Terminal (Fastest)**
This runs the tests in a headless browser and prints the results to your terminal.

1.  Install the required Python packages (only needed once):
    ```bash
    pip install -r test/requirements.txt
    ```
2.  Run the test runner:
    ```bash
    python test/run_headless.py
    ```

**Option B: Visual (Live Server)**

1.  Install the "Live Server" extension (Ritwick Dey) in VS Code.
2.  Right-click on the `index.html` file in the root directory (or any file) and select "Open with Live Server".
    - _Note: Ensure the server root is the project folder `Proyectos_FGO`, not the `test` folder._
3.  Navigate to `http://127.0.0.1:5500/test/unit/index.html` in your browser.

**Option C: Visual (Python Server)**

1.  Run this command from the project root (`e:\Programacion\Proyectos_FGO`):
    ```bash
    python -m http.server 8000
    ```
2.  Open your browser and navigate to:
    `http://localhost:8000/test/unit/index.html`

The results will appear on the screen (Green = Pass, Red = Fail).

### 2. Production Check (Integration)

This script checks if all critical files exist and if the configuration is correct before deploying or committing.

1.  Run the Python script from the terminal:
    ```powershell
    python test/integration/production_check.py
    ```
2.  If everything is correct, you will see "✨ ALL CHECKS PASSED!".

## Adding New Tests

- **Unit:** Create a new `.test.js` file in `test/unit/` and import it in `test/unit/index.html`.
- **Integration:** Add new checks to `test/integration/production_check.py`.
