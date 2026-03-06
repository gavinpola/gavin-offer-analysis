// Mill Compensation Analysis - Interactive Charts

// Constants
const FULLY_DILUTED_SHARES = 399872153;
const SERIES_C_PRICE = 0.9264;
const STRIKE_PRICE = 0.28;
const MIDDLE_OPTION_SHARES = 133818;
const DILUTION = 0.20;

// Calculate equity value at exit
function calculateEquityValue(shares, exitValuation, dilution = 0.20) {
    const effectiveShares = shares * (1 - dilution);
    const exitPricePerShare = exitValuation / FULLY_DILUTED_SHARES;
    const grossValue = effectiveShares * exitPricePerShare;
    const exerciseCost = effectiveShares * STRIKE_PRICE;
    const netValue = Math.max(0, grossValue - exerciseCost);
    return {
        effectiveShares,
        exitPricePerShare,
        grossValue,
        exerciseCost,
        netValue
    };
}

// Format currency
function formatMoney(amount) {
    if (amount >= 1000000000) {
        return '$' + (amount / 1000000000).toFixed(1) + 'B';
    } else if (amount >= 1000000) {
        return '$' + (amount / 1000000).toFixed(1) + 'M';
    } else {
        return '$' + amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
}

// Exit Scenario Chart
function createExitChart() {
    const ctx = document.getElementById('exitChart');
    if (!ctx) return;

    const exitValuations = [370e6, 500e6, 750e6, 1e9, 1.5e9, 2e9, 3e9, 5e9];
    const labels = exitValuations.map(v => formatMoney(v));
    const equityValues = exitValuations.map(v => {
        const eq = calculateEquityValue(MIDDLE_OPTION_SHARES, v, DILUTION);
        return eq.netValue;
    });

    // BCG cash gap line (constant)
    const cashGap = 562050;
    const cashGapLine = exitValuations.map(() => cashGap);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Net Equity Value',
                    data: equityValues,
                    backgroundColor: 'rgba(56, 161, 105, 0.7)',
                    borderColor: 'rgba(56, 161, 105, 1)',
                    borderWidth: 2,
                    borderRadius: 4
                },
                {
                    label: 'BCG Cash Gap to Cover',
                    data: cashGapLine,
                    type: 'line',
                    borderColor: 'rgba(221, 107, 32, 1)',
                    backgroundColor: 'rgba(221, 107, 32, 0.1)',
                    borderWidth: 3,
                    borderDash: [8, 4],
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatMoney(context.raw);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatMoney(value);
                        }
                    },
                    title: {
                        display: true,
                        text: 'Value'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Exit Valuation'
                    }
                }
            }
        }
    });
}

// Smooth scroll for navigation (if we add nav links later)
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// Add scroll animation for cards
function setupScrollAnimation() {
    const cards = document.querySelectorAll('.card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    createExitChart();
    setupSmoothScroll();
    setupScrollAnimation();
});

// Console log for debugging
console.log('Mill Analysis loaded');
console.log('Middle option equity at $1B exit:', formatMoney(calculateEquityValue(MIDDLE_OPTION_SHARES, 1e9, DILUTION).netValue));
console.log('Middle option equity at $3B exit:', formatMoney(calculateEquityValue(MIDDLE_OPTION_SHARES, 3e9, DILUTION).netValue));
