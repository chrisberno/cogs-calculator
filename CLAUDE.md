# COGS Calculator - Claude Code Context

## Project Overview
This is a CPaaS COGS (Cost of Goods Sold) calculator designed for SaaS platforms. Originally built for Twilio Flex pricing but abstracted to be vendor-agnostic for broader applicability.

## Current State
- ✅ Functional web-based calculator
- ✅ Dual billing model support (hourly vs named user)
- ✅ Real-time calculations with export
- ✅ Published to GitHub: https://github.com/chrisberno/cogs-calculator

## Strategic Enhancements TODO

### Phase 1: Data Persistence & Tracking
- [ ] **Forecast Snapshots**: Add database table to store forecast configurations
  - Timestamp, assumptions, configuration, calculated costs
  - Enable historical comparison of forecasts vs actuals
- [ ] **Version Tagging**: Tag each forecast with application version for correlation
- [ ] **Audit Trail**: Complete logging of all forecasts with metadata

### Phase 2: Actual Cost Integration
- [ ] **API Integration**: Connect to Twilio (or other CPaaS) APIs for real usage data
- [ ] **Variance Analysis**: Compare forecasted vs actual costs
- [ ] **Alerting**: Notify when actuals exceed forecasts by threshold
- [ ] **Trend Analysis**: Identify usage patterns and cost trends

### Phase 3: Advanced Features
- [ ] **Multi-tenant Support**: Allow different departments/projects to track separately
- [ ] **Budget Management**: Set and track against budget limits
- [ ] **What-if Scenarios**: Save and compare multiple forecast scenarios
- [ ] **Margin Calculator**: Add revenue inputs for profit margin analysis

### Phase 4: Enterprise Integration
- [ ] **SSO Integration**: Enterprise authentication
- [ ] **API Endpoints**: Programmatic access for automation
- [ ] **Export Integration**: Direct integration with accounting systems
- [ ] **Custom Pricing Models**: Support for negotiated/enterprise rates

## Integration Notes

### For Connie.plus Integration
When integrating into connie.plus, the Connie CTO should:
1. Convert to React + Twilio Paste components
2. Place in `/admin/cogs-calculator` route
3. Add admin-only access control
4. Re-brand from generic CPaaS back to Twilio-specific
5. Consider using connie.plus's existing database for persistence

### Technical Debt to Address
- Consider moving calculations to backend for better security
- Add input validation and error handling
- Implement proper state management if converting to React
- Add comprehensive unit tests for calculation logic

## Development Guidelines

### When Working on This Project
1. Maintain vendor-agnostic approach in main branch
2. Create vendor-specific branches for customizations
3. Keep calculation logic separate from UI for reusability
4. Document any pricing changes or formula updates

### Testing Considerations
- Verify calculations against known pricing scenarios
- Test edge cases (0 agents, max hours, etc.)
- Ensure export functionality works across browsers
- Validate mobile responsiveness

## Notes
- Original request was to track COGS for scaling SaaS platforms
- Initially built for Twilio Flex, abstracted for broader use
- Planned integration into connie.plus for forecast validation
- Long-term vision: comprehensive SaaS cost management platform