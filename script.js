// Investment metrics thresholds and directions
// direction: 'greater' means higher is better, 'less' means lower is better
const THRESHOLDS = {
    capRate: {
        good: 7,      // %
        caution: 5,   // %
        direction: 'greater',
        label: 'Cap Rate',
        goodText: 'Cap Rate > 7% is good',
        cautionText: 'Cap Rate 5-7% is caution',
        badText: 'Cap Rate < 5% is bad',
    },
    cashOnCash: {
        good: 8,      // %
        caution: 5,   // %
        direction: 'greater',
        label: 'Cash on Cash Return',
        goodText: 'Cash on Cash > 8% is good',
        cautionText: 'Cash on Cash 5-8% is caution',
        badText: 'Cash on Cash < 5% is bad',
    },
    vacancyRate: {
        good: 5,      // %
        caution: 10,  // %
        direction: 'less',
        label: 'Vacancy Rate',
        goodText: 'Vacancy Rate < 5% is good',
        cautionText: 'Vacancy Rate 5-10% is caution',
        badText: 'Vacancy Rate > 10% is bad',
    },
    cashFlow: {
        good: 1000,   // $/mo
        caution: 500, // $/mo
        direction: 'greater',
        label: 'Monthly Cash Flow',
        goodText: 'Cash Flow > $1000/mo is good',
        cautionText: 'Cash Flow $500-$1000/mo is caution',
        badText: 'Cash Flow < $500/mo is bad',
    }
};

function getIndicatorClass(value, metric) {
    const t = THRESHOLDS[metric];
    if (t.direction === 'less') {
        if (value < t.good) return 'good';
        if (value < t.caution) return 'caution';
        return 'bad';
    } else {
        if (value > t.good) return 'good';
        if (value > t.caution) return 'caution';
        return 'bad';
    }
}

function getTooltipText(value, metric) {
    const t = THRESHOLDS[metric];
    if (t.direction === 'less') {
        if (value < t.good) return t.goodText;
        if (value < t.caution) return t.cautionText;
        return t.badText;
    } else {
        if (value > t.good) return t.goodText;
        if (value > t.caution) return t.cautionText;
        return t.badText;
    }
}

function createIndicator(value, metric) {
    const indicatorClass = getIndicatorClass(value, metric);
    const tooltipText = getTooltipText(value, metric);
    return `
        <span class="indicator ${indicatorClass}"></span>
        <span class="tooltip">
            <span class="tooltip-text">${tooltipText}</span>
        </span>
    `;
}

function calculateReturns() {
    // Get input values
    const propertyValue = parseFloat(document.getElementById('propertyValue').value) || 0;
    const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
    const loanTerm = parseFloat(document.getElementById('loanTerm').value) || 0;
    const units = parseInt(document.getElementById('units').value) || 0;
    const monthlyRent = parseFloat(document.getElementById('monthlyRent').value) || 0;
    const vacancyRate = parseFloat(document.getElementById('vacancyRate').value) || 0;
    const expenses = parseFloat(document.getElementById('expenses').value) || 0;

    // Calculate loan amount
    const loanAmount = propertyValue - downPayment;

    // Calculate monthly mortgage payment
    const monthlyInterestRate = (interestRate / 100) / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyMortgage = loanAmount * 
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    // Calculate total monthly income
    const totalIncome = (monthlyRent * units) * (1 - (vacancyRate / 100));

    // Calculate NOI
    const noi = totalIncome - expenses;

    // Calculate cash flow
    const cashFlow = noi - monthlyMortgage;

    // Calculate cap rate
    const capRate = (noi * 12 / propertyValue) * 100;

    // Calculate cash on cash return
    const cashOnCash = (cashFlow * 12 / downPayment) * 100;

    // Display results with indicators
    document.getElementById('monthlyMortgage').innerHTML = formatCurrency(monthlyMortgage);
    document.getElementById('totalIncome').innerHTML = formatCurrency(totalIncome);
    document.getElementById('noi').innerHTML = formatCurrency(noi);
    document.getElementById('cashFlow').innerHTML = formatCurrency(cashFlow) + createIndicator(cashFlow, 'cashFlow');
    document.getElementById('capRate').innerHTML = capRate.toFixed(2) + '%' + createIndicator(capRate, 'capRate');
    document.getElementById('cashOnCash').innerHTML = cashOnCash.toFixed(2) + '%' + createIndicator(cashOnCash, 'cashOnCash');

    // Show results section
    document.getElementById('results').classList.add('active');
}

function resetCalculator() {
    // Clear all input fields
    document.getElementById('propertyValue').value = '';
    document.getElementById('downPayment').value = '';
    document.getElementById('interestRate').value = '';
    document.getElementById('loanTerm').value = '';
    document.getElementById('units').value = '';
    document.getElementById('monthlyRent').value = '';
    document.getElementById('vacancyRate').value = '';
    document.getElementById('expenses').value = '';
    // Hide results
    document.getElementById('results').classList.remove('active');
}

function formatCurrency(value) {
    return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
} 