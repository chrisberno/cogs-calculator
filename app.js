// CPaaS Platform Pricing Calculator JavaScript

// Standard CPaaS pricing data
const RATES = {
    platform: {
        hourly: 1.00,
        named_user: 150.00
    },
    network: {
        voice_inbound: 0.0085,
        voice_outbound: 0.014,
        sms: 0.0083,
        whatsapp: 0.005,
        email: 19.95
    }
};

const DEFAULT_VALUES = {
    agents: 10,
    hours: 160,
    inbound_minutes: 5000,
    outbound_minutes: 3000,
    sms_count: 1000,
    whatsapp_count: 500,
    email_packages: 1
};

// Global calculator instance
let calculator = null;

class CPaaSPricingCalculator {
    constructor() {
        console.log('CPaaSPricingCalculator constructor called');
        this.initializeElements();
        this.attachEventListeners();
        this.calculateCosts();
        console.log('Calculator initialized successfully');
    }

    initializeElements() {
        console.log('Initializing elements...');
        
        // Input elements
        this.billingModelInputs = document.querySelectorAll('input[name="billingModel"]');
        this.agentsInput = document.getElementById('agents');
        this.hoursInput = document.getElementById('hours');
        this.hoursGroup = document.getElementById('hoursGroup');
        this.inboundVoiceInput = document.getElementById('inboundVoice');
        this.outboundVoiceInput = document.getElementById('outboundVoice');
        this.smsInput = document.getElementById('sms');
        this.whatsappInput = document.getElementById('whatsapp');
        this.emailInput = document.getElementById('email');

        // Display elements
        this.totalCostDisplay = document.getElementById('totalCost');
        this.platformCostDisplay = document.getElementById('platformCost');
        this.platformDetailDisplay = document.getElementById('platformDetail');
        this.inboundCostDisplay = document.getElementById('inboundCost');
        this.outboundCostDisplay = document.getElementById('outboundCost');
        this.smsCostDisplay = document.getElementById('smsCost');
        this.whatsappCostDisplay = document.getElementById('whatsappCost');
        this.emailCostDisplay = document.getElementById('emailCost');
        this.networkCostDisplay = document.getElementById('networkCost');

        // Buttons and modal
        this.resetBtn = document.getElementById('resetBtn');
        this.compareBtn = document.getElementById('compareBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.compareModal = document.getElementById('compareModal');
        this.closeModalBtn = document.getElementById('closeModal');

        // Comparison elements
        this.hourlyTotalDisplay = document.getElementById('hourlyTotal');
        this.namedTotalDisplay = document.getElementById('namedTotal');
        this.hourlyBreakdownDisplay = document.getElementById('hourlyBreakdown');
        this.namedBreakdownDisplay = document.getElementById('namedBreakdown');
        this.savingsIndicator = document.getElementById('savingsIndicator');

        console.log('Elements initialized. Key elements found:', {
            billingModelInputs: this.billingModelInputs.length,
            agentsInput: !!this.agentsInput,
            resetBtn: !!this.resetBtn,
            compareBtn: !!this.compareBtn,
            exportBtn: !!this.exportBtn,
            totalCostDisplay: !!this.totalCostDisplay
        });
    }

    attachEventListeners() {
        console.log('Attaching event listeners...');
        
        // Billing model radio buttons
        this.billingModelInputs.forEach((input, index) => {
            console.log(`Attaching listener to radio button ${index}:`, input.value);
            input.addEventListener('change', () => {
                console.log('Radio button changed to:', input.value);
                this.handleBillingModelChange();
                this.calculateCosts();
            });
        });

        // Input field listeners for real-time updates
        const inputElements = [
            { element: this.agentsInput, name: 'agents' },
            { element: this.hoursInput, name: 'hours' },
            { element: this.inboundVoiceInput, name: 'inboundVoice' },
            { element: this.outboundVoiceInput, name: 'outboundVoice' },
            { element: this.smsInput, name: 'sms' },
            { element: this.whatsappInput, name: 'whatsapp' },
            { element: this.emailInput, name: 'email' }
        ];

        inputElements.forEach(({ element, name }) => {
            if (element) {
                console.log(`Attaching listeners to ${name} input`);
                element.addEventListener('input', () => {
                    console.log(`${name} input changed to:`, element.value);
                    this.calculateCosts();
                });
                element.addEventListener('change', () => {
                    console.log(`${name} changed to:`, element.value);
                    this.calculateCosts();
                });
            } else {
                console.warn(`${name} input element not found`);
            }
        });

        // Button listeners
        if (this.resetBtn) {
            console.log('Attaching reset button listener');
            this.resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Reset button clicked');
                this.resetInputs();
                return false;
            });
        }

        if (this.compareBtn) {
            console.log('Attaching compare button listener');
            this.compareBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Compare button clicked');
                this.showComparison();
                return false;
            });
        }

        if (this.exportBtn) {
            console.log('Attaching export button listener');
            this.exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Export button clicked');
                this.exportSummary();
                return false;
            });
        }

        if (this.closeModalBtn) {
            this.closeModalBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideComparison();
                return false;
            });
        }

        // Modal backdrop click
        if (this.compareModal) {
            this.compareModal.addEventListener('click', (e) => {
                if (e.target === this.compareModal) {
                    this.hideComparison();
                }
            });
        }

        console.log('Event listeners attached successfully');
    }

    handleBillingModelChange() {
        const selectedRadio = document.querySelector('input[name="billingModel"]:checked');
        if (!selectedRadio) {
            console.warn('No billing model selected');
            return;
        }

        const modelValue = selectedRadio.value;
        console.log('Handling billing model change to:', modelValue);
        
        if (!this.hoursGroup) {
            console.warn('Hours group element not found');
            return;
        }

        if (modelValue === 'hourly') {
            this.hoursGroup.style.display = 'block';
            this.hoursGroup.classList.remove('hidden');
            console.log('Showing hours group for hourly model');
        } else {
            this.hoursGroup.style.display = 'none';
            this.hoursGroup.classList.add('hidden');
            console.log('Hiding hours group for named user model');
        }
    }

    calculateCosts() {
        console.log('Starting cost calculation...');
        
        try {
            const selectedRadio = document.querySelector('input[name="billingModel"]:checked');
            if (!selectedRadio) {
                console.warn('No billing model selected, using default hourly');
                // Default to hourly if none selected
                const hourlyRadio = document.querySelector('input[name="billingModel"][value="hourly"]');
                if (hourlyRadio) {
                    hourlyRadio.checked = true;
                }
            }

            const billingModel = selectedRadio?.value || 'hourly';
            const agents = parseInt(this.agentsInput?.value || '0') || 0;
            const hours = parseInt(this.hoursInput?.value || '0') || 0;
            const inboundMinutes = parseInt(this.inboundVoiceInput?.value || '0') || 0;
            const outboundMinutes = parseInt(this.outboundVoiceInput?.value || '0') || 0;
            const smsCount = parseInt(this.smsInput?.value || '0') || 0;
            const whatsappCount = parseInt(this.whatsappInput?.value || '0') || 0;
            const emailPackages = parseInt(this.emailInput?.value || '0') || 0;

            console.log('Input values:', {
                billingModel, agents, hours, inboundMinutes, 
                outboundMinutes, smsCount, whatsappCount, emailPackages
            });

            // Calculate platform cost
            let platformCost = 0;
            if (billingModel === 'hourly') {
                platformCost = agents * hours * RATES.platform.hourly;
            } else {
                platformCost = agents * RATES.platform.named_user;
            }

            // Calculate network costs
            const inboundCost = inboundMinutes * RATES.network.voice_inbound;
            const outboundCost = outboundMinutes * RATES.network.voice_outbound;
            const smsCost = smsCount * RATES.network.sms;
            const whatsappCost = whatsappCount * RATES.network.whatsapp;
            const emailCost = emailPackages * RATES.network.email;

            const networkCost = inboundCost + outboundCost + smsCost + whatsappCost + emailCost;
            const totalCost = platformCost + networkCost;

            console.log('Calculated costs:', {
                platformCost, inboundCost, outboundCost, smsCost, 
                whatsappCost, emailCost, networkCost, totalCost
            });

            // Update displays
            this.updateDisplays({
                platformCost, inboundCost, outboundCost, smsCost,
                whatsappCost, emailCost, networkCost, totalCost,
                billingModel, agents, hours
            });

        } catch (error) {
            console.error('Error in calculateCosts:', error);
        }
    }

    updateDisplays(costs) {
        console.log('Updating displays with costs:', costs);
        
        try {
            // Update cost displays
            if (this.totalCostDisplay) {
                this.totalCostDisplay.textContent = this.formatCurrency(costs.totalCost);
            }
            if (this.platformCostDisplay) {
                this.platformCostDisplay.textContent = this.formatCurrency(costs.platformCost);
            }
            if (this.inboundCostDisplay) {
                this.inboundCostDisplay.textContent = this.formatCurrency(costs.inboundCost);
            }
            if (this.outboundCostDisplay) {
                this.outboundCostDisplay.textContent = this.formatCurrency(costs.outboundCost);
            }
            if (this.smsCostDisplay) {
                this.smsCostDisplay.textContent = this.formatCurrency(costs.smsCost);
            }
            if (this.whatsappCostDisplay) {
                this.whatsappCostDisplay.textContent = this.formatCurrency(costs.whatsappCost);
            }
            if (this.emailCostDisplay) {
                this.emailCostDisplay.textContent = this.formatCurrency(costs.emailCost);
            }
            if (this.networkCostDisplay) {
                this.networkCostDisplay.textContent = this.formatCurrency(costs.networkCost);
            }

            // Update platform detail
            if (this.platformDetailDisplay) {
                if (costs.billingModel === 'hourly') {
                    this.platformDetailDisplay.textContent = 
                        `${costs.agents} agents × ${costs.hours} hours × $${RATES.platform.hourly.toFixed(2)}`;
                } else {
                    this.platformDetailDisplay.textContent = 
                        `${costs.agents} agents × $${RATES.platform.named_user.toFixed(2)}/month`;
                }
            }

            console.log('Displays updated successfully');
        } catch (error) {
            console.error('Error updating displays:', error);
        }
    }

    resetInputs() {
        console.log('Resetting all inputs to defaults');
        
        try {
            // Set default values
            if (this.agentsInput) this.agentsInput.value = DEFAULT_VALUES.agents;
            if (this.hoursInput) this.hoursInput.value = DEFAULT_VALUES.hours;
            if (this.inboundVoiceInput) this.inboundVoiceInput.value = DEFAULT_VALUES.inbound_minutes;
            if (this.outboundVoiceInput) this.outboundVoiceInput.value = DEFAULT_VALUES.outbound_minutes;
            if (this.smsInput) this.smsInput.value = DEFAULT_VALUES.sms_count;
            if (this.whatsappInput) this.whatsappInput.value = DEFAULT_VALUES.whatsapp_count;
            if (this.emailInput) this.emailInput.value = DEFAULT_VALUES.email_packages;

            // Reset to hourly billing model
            const hourlyRadio = document.querySelector('input[name="billingModel"][value="hourly"]');
            if (hourlyRadio) {
                hourlyRadio.checked = true;
                this.handleBillingModelChange();
            }

            // Recalculate costs
            this.calculateCosts();

            this.showNotification('Values reset to defaults', 'success');
            console.log('Reset completed successfully');
        } catch (error) {
            console.error('Error during reset:', error);
            this.showNotification('Error resetting values', 'error');
        }
    }

    showComparison() {
        console.log('Opening comparison modal');
        
        try {
            const agents = parseInt(this.agentsInput?.value || '10') || 10;
            const hours = parseInt(this.hoursInput?.value || '160') || 160;
            
            // Calculate network cost once
            const networkCost = this.calculateNetworkCost();
            
            // Calculate both platform costs
            const hourlyPlatformCost = agents * hours * RATES.platform.hourly;
            const namedPlatformCost = agents * RATES.platform.named_user;
            
            const hourlyCost = hourlyPlatformCost + networkCost;
            const namedCost = namedPlatformCost + networkCost;

            console.log('Comparison costs:', { hourlyCost, namedCost, networkCost });

            // Update comparison displays
            if (this.hourlyTotalDisplay) {
                this.hourlyTotalDisplay.textContent = this.formatCurrency(hourlyCost);
            }
            if (this.namedTotalDisplay) {
                this.namedTotalDisplay.textContent = this.formatCurrency(namedCost);
            }

            if (this.hourlyBreakdownDisplay) {
                this.hourlyBreakdownDisplay.innerHTML = `
                    <div>Platform: $${this.formatCurrency(hourlyPlatformCost)}</div>
                    <div>Network: $${this.formatCurrency(networkCost)}</div>
                    <div><small>${agents} agents × ${hours} hours × $1.00</small></div>
                `;
            }

            if (this.namedBreakdownDisplay) {
                this.namedBreakdownDisplay.innerHTML = `
                    <div>Platform: $${this.formatCurrency(namedPlatformCost)}</div>
                    <div>Network: $${this.formatCurrency(networkCost)}</div>
                    <div><small>${agents} agents × $150.00/month</small></div>
                `;
            }

            // Update savings indicator
            const difference = Math.abs(hourlyCost - namedCost);
            if (this.savingsIndicator) {
                if (hourlyCost < namedCost) {
                    this.savingsIndicator.className = 'savings-indicator savings';
                    this.savingsIndicator.textContent = `💰 Hourly model saves $${this.formatCurrency(difference)} per month`;
                } else if (namedCost < hourlyCost) {
                    this.savingsIndicator.className = 'savings-indicator savings';
                    this.savingsIndicator.textContent = `💰 Named user model saves $${this.formatCurrency(difference)} per month`;
                } else {
                    this.savingsIndicator.className = 'savings-indicator';
                    this.savingsIndicator.textContent = '⚖️ Both models cost the same';
                }
            }

            // Show modal
            if (this.compareModal) {
                this.compareModal.classList.remove('hidden');
                console.log('Modal shown');
            } else {
                console.error('Compare modal not found');
            }
        } catch (error) {
            console.error('Error showing comparison:', error);
        }
    }

    hideComparison() {
        console.log('Hiding comparison modal');
        if (this.compareModal) {
            this.compareModal.classList.add('hidden');
        }
    }

    calculateNetworkCost() {
        const inboundMinutes = parseInt(this.inboundVoiceInput?.value || '0') || 0;
        const outboundMinutes = parseInt(this.outboundVoiceInput?.value || '0') || 0;
        const smsCount = parseInt(this.smsInput?.value || '0') || 0;
        const whatsappCount = parseInt(this.whatsappInput?.value || '0') || 0;
        const emailPackages = parseInt(this.emailInput?.value || '0') || 0;

        return (inboundMinutes * RATES.network.voice_inbound) +
               (outboundMinutes * RATES.network.voice_outbound) +
               (smsCount * RATES.network.sms) +
               (whatsappCount * RATES.network.whatsapp) +
               (emailPackages * RATES.network.email);
    }

    exportSummary() {
        console.log('Starting export summary');
        
        try {
            const selectedRadio = document.querySelector('input[name="billingModel"]:checked');
            const billingModel = selectedRadio?.value || 'hourly';
            const agents = parseInt(this.agentsInput?.value || '10') || 10;
            const hours = parseInt(this.hoursInput?.value || '160') || 160;
            
            const summary = this.generateSummaryText(billingModel, agents, hours);
            console.log('Generated summary text');
            
            // Try to download the file
            try {
                const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `cpaas-pricing-${new Date().toISOString().split('T')[0]}.txt`;
                
                // Temporarily add to DOM and click
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                URL.revokeObjectURL(url);
                
                this.showNotification('Summary exported successfully!', 'success');
                console.log('Export completed successfully');
            } catch (downloadError) {
                console.warn('Download failed, trying clipboard:', downloadError);
                
                // Fallback to clipboard
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(summary).then(() => {
                        this.showNotification('Summary copied to clipboard!', 'success');
                    }).catch(() => {
                        this.showNotification('Export failed', 'error');
                    });
                } else {
                    // Final fallback - show in alert
                    alert('Summary (copy this text):\n\n' + summary);
                    this.showNotification('Summary shown in popup', 'info');
                }
            }
        } catch (error) {
            console.error('Error in exportSummary:', error);
            this.showNotification('Export failed', 'error');
        }
    }

    generateSummaryText(billingModel, agents, hours) {
        const platformCost = billingModel === 'hourly' 
            ? agents * hours * RATES.platform.hourly
            : agents * RATES.platform.named_user;
        const networkCost = this.calculateNetworkCost();
        const totalCost = platformCost + networkCost;

        return `CPAAS PLATFORM PRICING CALCULATOR SUMMARY
Generated: ${new Date().toLocaleString()}

CONFIGURATION:
- Billing Model: ${billingModel === 'hourly' ? 'Per Active User Hour' : 'Per Named User'}
- Number of Agents: ${agents}
${billingModel === 'hourly' ? `- Hours per Agent: ${hours}` : ''}

MONTHLY USAGE:
- Inbound Voice Minutes: ${this.inboundVoiceInput?.value || '0'}
- Outbound Voice Minutes: ${this.outboundVoiceInput?.value || '0'}
- SMS Messages: ${this.smsInput?.value || '0'}
- WhatsApp Messages: ${this.whatsappInput?.value || '0'}
- Email Packages: ${this.emailInput?.value || '0'}

COST BREAKDOWN:
- Platform Cost: $${this.formatCurrency(platformCost)}
- Network Cost: $${this.formatCurrency(networkCost)}
- TOTAL MONTHLY COST: $${this.formatCurrency(totalCost)}

CURRENT RATES:
- Platform (Hourly): $${RATES.platform.hourly}/hour
- Platform (Named User): $${RATES.platform.named_user}/month
- Inbound Voice: $${RATES.network.voice_inbound}/minute
- Outbound Voice: $${RATES.network.voice_outbound}/minute
- SMS: $${RATES.network.sms}/message
- WhatsApp: $${RATES.network.whatsapp}/message
- Email: $${RATES.network.email}/package`;
    }

    formatCurrency(amount) {
        return amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    showNotification(message, type = 'info') {
        console.log(`Notification: ${message} (${type})`);
        
        const notification = document.createElement('div');
        notification.className = `status status--${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            min-width: 200px;
            padding: 12px 16px;
            border-radius: 8px;
            font-weight: 500;
            transition: opacity 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing calculator...');
    try {
        calculator = new CPaaSPricingCalculator();
        console.log('Calculator initialized successfully');
    } catch (error) {
        console.error('Failed to initialize calculator:', error);
    }
});