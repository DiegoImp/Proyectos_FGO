/**
 * ============================================================
 * CUSTOMSELECT.JS - Custom Select Dropdown Component
 * ============================================================
 * Componente de select personalizado con apariencia de dropdown.
 * Implementado completamente con divs para total personalización.
 * 
 * Basado en mejores prácticas de:
 * - MDN Select: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
 * - MDN Custom Elements: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
 * ============================================================
 */

/**
 * Clase CustomSelect
 * Maneja la lógica de un select dropdown personalizado
 */
export class CustomSelect {
    /**
     * @param {Object} config - Configuración del custom select
     * @param {string} config.customSelectId - ID del contenedor custom
     * @param {string} config.triggerId - ID del elemento trigger
     * @param {string} config.optionsListId - ID de la lista de opciones
     * @param {string} config.selectedTextId - ID del texto seleccionado
     * @param {Function} config.onChange - Callback al cambiar selección
     */
    constructor(config) {
        this.customSelect = document.getElementById(config.customSelectId);
        this.trigger = document.getElementById(config.triggerId);
        this.optionsList = document.getElementById(config.optionsListId);
        this.selectedText = document.getElementById(config.selectedTextId);
        this.onChange = config.onChange || null;

        if (!this.customSelect || !this.trigger || !this.optionsList) {
            console.error('CustomSelect: Faltan elementos requeridos');
            return;
        }

        this.options = this.optionsList.querySelectorAll('.ms_option');
        this.isOpen = false;
        this.currentValue = null;

        this.init();
    }

    /**
     * Inicializa el componente y sus event listeners
     */
    init() {
        // Click en el trigger para abrir/cerrar
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        // Click en cada opción
        this.options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectOption(option);
            });
        });

        // Cerrar al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!this.customSelect.contains(e.target)) {
                this.close();
            }
        });

        // Teclado: ESC para cerrar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Seleccionar primera opción por defecto
        if (this.options.length > 0) {
            this.selectOption(this.options[0], false);
        }
    }

    /**
     * Alterna entre abrir y cerrar el dropdown
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Abre el dropdown
     */
    open() {
        this.isOpen = true;
        this.optionsList.classList.add('open');
        this.trigger.classList.add('active');
        this.customSelect.setAttribute('aria-expanded', 'true');
    }

    /**
     * Cierra el dropdown
     */
    close() {
        this.isOpen = false;
        this.optionsList.classList.remove('open');
        this.trigger.classList.remove('active');
        this.customSelect.setAttribute('aria-expanded', 'false');
    }

    /**
     * Selecciona una opción
     * @param {HTMLElement} option - Elemento de opción seleccionado
     * @param {boolean} closeDropdown - Si debe cerrar el dropdown (default: true)
     */
    selectOption(option, closeDropdown = true) {
        const value = option.dataset.value;
        const text = option.textContent.trim();

        // Guardar valor actual
        this.currentValue = value;

        // Actualizar texto mostrado
        this.selectedText.textContent = text;

        // Actualizar clase selected en opciones
        this.options.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');

        // Cerrar dropdown si se solicita
        if (closeDropdown) {
            this.close();
        }

        // Ejecutar callback
        if (this.onChange && typeof this.onChange === 'function') {
            this.onChange(value, text);
        }
    }

    /**
     * Obtiene el valor actual seleccionado
     * @returns {string} Valor seleccionado
     */
    getValue() {
        return this.currentValue;
    }

    /**
     * Establece el valor seleccionado programáticamente
     * @param {string} value - Valor a seleccionar
     */
    setValue(value) {
        const matchingOption = Array.from(this.options).find(
            opt => opt.dataset.value === value
        );

        if (matchingOption) {
            this.selectOption(matchingOption, false);
        }
    }

    /**
     * Deshabilita o habilita el componente
     * @param {boolean} disabled - True para deshabilitar
     */
    setDisabled(disabled) {
        this.customSelect.classList.toggle('disabled', disabled);

        if (disabled) {
            this.close();
            this.trigger.style.pointerEvents = 'none';
        } else {
            this.trigger.style.pointerEvents = 'auto';
        }
    }

    /**
     * Destruye el componente y limpia event listeners
     */
    destroy() {
        this.close();
        // Clonar elementos para remover listeners
        const newTrigger = this.trigger.cloneNode(true);
        this.trigger.replaceWith(newTrigger);
    }
}

/**
 * Función auxiliar para inicializar rápidamente un CustomSelect
 * @param {Function} onChange - Callback opcional
 * @returns {CustomSelect} Instancia del componente
 */
export function initCustomSelect(onChange = null) {
    const config = {
        customSelectId: 'ms-custom-select',
        triggerId: 'ms-select-trigger',
        optionsListId: 'ms-options-list',
        selectedTextId: 'ms-selected-text',
        onChange: onChange
    };

    return new CustomSelect(config);
}
