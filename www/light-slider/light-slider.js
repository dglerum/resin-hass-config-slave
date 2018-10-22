class LightSlider extends Polymer.Element {
    static get template() {
        return Polymer.html`
        <style>
            :host {
                display: flex;
                align-items: center;
            }

            .flex {
                flex: 1;
                display: flex;
                justify-content: space-between;
                align-items: center;
                min-width: 0;
            }

            ha-paper-slider {
                width: 100%;
                margin-left: 6px;
            }
        </style>
        <state-badge
            state-obj="[[stateObj]]"
            override-icon="[[icon]]"
            on-click="stopPropagation">
        </state-badge>
        <div class="flex"
            on-click="stopPropagation">
            <ha-paper-slider
                min="[[min]]"
                max="[[max]]"
                value="{{value}}"
                ignore-bar-touch
                on-change="selectedValue">
            </ha-paper-slider>
        </div>
        `
    }

    static get properties() {
        return {
            _hass: Object,
            _config: Object,
            isOn: { type: Boolean },
            stateObj: { type: Object, value: null },
            icon: { type: String, value: 'hass:brightness-5' },
            switchEntity: { type: String, value: null },
            min: { type: Number, value: 0 },
            max: { type: Number, value: 255 },
            attribute: { type: String, value: 'brightness' },
            value: Number,
        };
    }

    setConfig(config) {
        this._config = config;
    }

    set hass(hass) {
        this._hass = hass;
        this.stateObj = this._config.entity in hass.states ? hass.states[this._config.entity] : null;
        if (this.stateObj) {
            if (this.stateObj.state === 'on') {
                this.value = this.stateObj.attributes[this.attribute];
                this.isOn = true;
            } else {
                this.value = this.min;
                this.isOn = false;
            }
        }
    }

    selectedValue(ev) {
        const value = parseInt(this.value, 10);
        const param = { entity_id: this.stateObj.entity_id };
        const switch_param = { entity_id: this._config.switchEntity };
        if (Number.isNaN(value)) return;
        if (value === 0) {
            this._hass.callService('light', 'turn_off', param);
            if (this._config.switchEntity) {
                this._hass.callService('switch', 'turn_off', switch_param);
            }
        } else {
            param[this.attribute] = value;
            this._hass.callService('light', 'turn_on', param);
            if (this._config.switchEntity) {
                this._hass.callService('switch', 'turn_on', switch_param);
            }
        }
    }

    stopPropagation(ev) {
        ev.stopPropagation();
    }
}

customElements.define('light-slider', LightSlider);
