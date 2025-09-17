# COGS Calculator - SaaS Cost Modeling Tool

A sophisticated web-based calculator for estimating Cost of Goods Sold (COGS) for SaaS platforms using Communications Platform as a Service (CPaaS) providers.

## Overview

This tool helps businesses accurately forecast and manage their operational costs when scaling SaaS services with CPaaS integration. It provides real-time cost calculations, billing model comparisons, and export capabilities for financial planning.

## Features

### Core Functionality
- **Dual Billing Models**: Compare hourly-based vs. named user pricing
- **Real-time Calculations**: Instant cost updates as you adjust parameters
- **Comprehensive Channel Coverage**: Voice (inbound/outbound), SMS, WhatsApp, Email
- **Cost Breakdown Visualization**: Detailed platform and network cost separation
- **Export Capabilities**: Download or copy pricing summaries for reporting
- **Model Comparison Tool**: Side-by-side comparison of billing models with savings indicators

### Technical Highlights
- Pure JavaScript implementation (no framework dependencies)
- Responsive design with mobile support
- Client-side calculations for data privacy
- Clean, maintainable architecture
- Easily customizable pricing parameters

## Getting Started

### Quick Start
1. Clone the repository:
```bash
git clone https://github.com/chrisberno/cogs-calculator.git
cd cogs-calculator
```

2. Open `index.html` in your browser or serve with any static web server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Or simply open the file
open index.html
```

### Usage

1. **Select Billing Model**: Choose between hourly or named user pricing
2. **Configure Agents**: Set the number of agents and working hours
3. **Input Usage Data**: Enter expected monthly usage for each channel
4. **Review Costs**: See real-time cost breakdown
5. **Compare Models**: Click "Compare Models" to see which billing option is more cost-effective
6. **Export Summary**: Download or copy detailed cost analysis

## File Structure

```
cogs-calculator/
├── index.html                      # Main application interface
├── app.js                          # Core calculator logic and event handling
├── style.css                       # Styling and responsive design
├── CPaaS_Calculator_With_Formulas.csv  # Reference pricing data
└── cpaas_pricing_calculator.csv        # Additional pricing reference
```

## Default Pricing Model

The calculator comes pre-configured with standard CPaaS industry rates:

### Platform Costs
- **Hourly Model**: $1.00/active user hour
- **Named User Model**: $150.00/user/month

### Network Costs
- **Inbound Voice**: $0.0085/minute
- **Outbound Voice**: $0.014/minute
- **SMS Messages**: $0.0083/message
- **WhatsApp Messages**: $0.005/message
- **Email Packages**: $19.95/package

*Note: These rates can be easily customized in the `app.js` file to match your specific CPaaS provider.*

## Customization

### Adapting for Your CPaaS Provider

To customize the pricing for your specific provider, modify the `RATES` object in `app.js`:

```javascript
const RATES = {
    platform: {
        hourly: 1.00,        // Your hourly rate
        named_user: 150.00   // Your monthly named user rate
    },
    network: {
        voice_inbound: 0.0085,
        voice_outbound: 0.014,
        sms: 0.0083,
        whatsapp: 0.005,
        email: 19.95
    }
};
```

## Roadmap

### Phase 1: Core Features ✅
- [x] Basic cost calculation
- [x] Dual billing model support
- [x] Model comparison tool
- [x] Export functionality
- [x] Responsive design

### Phase 2: Enhanced Analytics
- [ ] Historical data tracking
- [ ] Cost trend visualization
- [ ] Multi-currency support
- [ ] Volume-based discount tiers
- [ ] API integration for live pricing

### Phase 3: Enterprise Features
- [ ] Multiple CPaaS provider profiles
- [ ] Budget alerting and thresholds
- [ ] Advanced forecasting & projections
- [ ] What-if scenario planning
- [ ] Integration with accounting systems
- [ ] Team collaboration features

### Phase 4: Platform Evolution
- [ ] SaaS-wide COGS calculation beyond CPaaS
- [ ] Infrastructure cost modeling (AWS/Azure/GCP)
- [ ] Custom service tier configuration
- [ ] Margin and profitability analysis
- [ ] ROI calculations

## Use Cases

- **Financial Planning**: Accurately forecast monthly CPaaS costs
- **Vendor Comparison**: Evaluate different CPaaS providers using same metrics
- **Budget Optimization**: Identify the most cost-effective billing model
- **Scale Planning**: Understand cost implications of growth
- **Client Proposals**: Generate professional cost estimates

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Areas where contributions would be especially valuable:

- Additional CPaaS provider templates
- New communication channels
- Enhanced visualization features
- Internationalization support

## License

MIT License - See LICENSE file for details

## Author

Chris Berno - [GitHub](https://github.com/chrisberno)

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

*Built with focus on simplicity, accuracy, and extensibility for modern SaaS cost management.*