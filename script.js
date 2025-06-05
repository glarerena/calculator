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

    // Display results
    document.getElementById('monthlyMortgage').textContent = formatCurrency(monthlyMortgage);
    document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
    document.getElementById('noi').textContent = formatCurrency(noi);
    document.getElementById('cashFlow').textContent = formatCurrency(cashFlow);
    document.getElementById('capRate').textContent = capRate.toFixed(2) + '%';
    document.getElementById('cashOnCash').textContent = cashOnCash.toFixed(2) + '%';

    // Show results section
    document.getElementById('results').classList.add('active');
}

function formatCurrency(value) {
    return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
} 