// Tab Navigation
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        
        // Remove active class from all tabs and contents
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        e.target.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// Basic Calculator Functions
function calculateMetrics() {
    const totalBudget = parseFloat(document.getElementById('totalBudget').value) || 0;
    const cpm = parseFloat(document.getElementById('cpm').value) || 0;
    const ctr = parseFloat(document.getElementById('ctr').value) || 0;
    const conversionRate = parseFloat(document.getElementById('conversionRate').value) || 0;
    const aov = parseFloat(document.getElementById('aov').value) || 0;

    // Calculate impressions
    const impressions = Math.floor((totalBudget / cpm) * 1000);
    document.getElementById('impressions').textContent = formatNumber(impressions);

    // Calculate clicks
    const clicks = Math.floor(impressions * (ctr / 100));
    document.getElementById('clicks').textContent = formatNumber(clicks);

    // Calculate conversions
    const conversions = Math.floor(clicks * (conversionRate / 100));
    document.getElementById('conversions').textContent = formatNumber(conversions);

    // Calculate revenue
    const revenue = conversions * aov;
    document.getElementById('revenue').textContent = formatCurrency(revenue);

    // Calculate ROI
    const profit = revenue - totalBudget;
    const roi = totalBudget > 0 ? ((profit / totalBudget) * 100) : 0;
    document.getElementById('roi').textContent = roi.toFixed(2) + '%';

    // Calculate CPC
    const cpc = clicks > 0 ? totalBudget / clicks : 0;
    document.getElementById('cpc').textContent = formatCurrency(cpc);

    // Calculate CPA
    const cpa = conversions > 0 ? totalBudget / conversions : 0;
    document.getElementById('cpa').textContent = formatCurrency(cpa);

    // Cost Per Sale
    const costPerSale = conversions > 0 ? totalBudget / conversions : 0;
    document.getElementById('costPerSale').textContent = formatCurrency(costPerSale);

    // ROAS
    const roas = totalBudget > 0 ? (revenue / totalBudget).toFixed(2) : 0;
    document.getElementById('roas').textContent = roas + 'x';
}

// Advanced Calculator Functions
function calculateAdvanced() {
    const platform = document.getElementById('platform').value;
    const duration = parseFloat(document.getElementById('duration').value) || 0;
    const dailyBudget = parseFloat(document.getElementById('dailyBudget').value) || 0;
    const reach = parseFloat(document.getElementById('reach').value) || 0;
    
    const totalBudget = dailyBudget * duration;
    const totalImpressions = reach * 3; // Assuming 3 impressions per unique user

    // Calculate Frequency
    const frequency = reach > 0 ? (totalImpressions / reach).toFixed(2) : 0;
    document.getElementById('frequency').textContent = frequency;

    // Calculate effective CPM
    const effectiveCPM = totalImpressions > 0 ? ((totalBudget / totalImpressions) * 1000).toFixed(2) : 0;
    document.getElementById('effectiveCPM').textContent = formatCurrency(effectiveCPM);

    // Calculate Engagement Rate
    const engagementRate = reach > 0 ? ((reach / totalImpressions) * 100).toFixed(2) : 0;
    document.getElementById('engagementRate').textContent = engagementRate + '%';

    // Calculate Breakeven Point
    const aov = parseFloat(document.getElementById('aov').value) || 0;
    const conversionRate = parseFloat(document.getElementById('conversionRate').value) || 0;
    
    if (conversionRate > 0 && aov > 0) {
        const conversionRate_decimal = conversionRate / 100;
        const ctr = parseFloat(document.getElementById('ctr').value) / 100 || 0.025;
        const cpc = (totalBudget / (totalImpressions * ctr)) || 0;
        
        const breakeven = cpc > 0 ? Math.ceil((cpc * 100) / (aov * conversionRate_decimal)) : 0;
        document.getElementById('breakeven').textContent = formatNumber(breakeven) + ' sales';
    }

    generatePerformanceChart();
}

// Budget Allocation Functions
function calculateBudgetAllocation() {
    const marketingBudget = parseFloat(document.getElementById('marketingBudget').value) || 0;
    const facebookAlloc = parseFloat(document.getElementById('facebookAlloc').value) || 0;
    const googleAlloc = parseFloat(document.getElementById('googleAlloc').value) || 0;
    const tiktokAlloc = parseFloat(document.getElementById('tiktokAlloc').value) || 0;
    const otherAlloc = parseFloat(document.getElementById('otherAlloc').value) || 0;

    const facebookBudget = (marketingBudget * facebookAlloc) / 100;
    const googleBudget = (marketingBudget * googleAlloc) / 100;
    const tiktokBudget = (marketingBudget * tiktokAlloc) / 100;
    const otherBudget = (marketingBudget * otherAlloc) / 100;

    document.getElementById('facebookVal').textContent = formatCurrency(facebookBudget);
    document.getElementById('googleVal').textContent = formatCurrency(googleBudget);
    document.getElementById('tiktokVal').textContent = formatCurrency(tiktokBudget);
    document.getElementById('otherVal').textContent = formatCurrency(otherBudget);

    generateDailyBreakdown(
        (marketingBudget * facebookAlloc) / 100,
        (marketingBudget * googleAlloc) / 100,
        (marketingBudget * tiktokAlloc) / 100,
        (marketingBudget * otherAlloc) / 100,
        30
    );
}

function generateDailyBreakdown(fb, google, tiktok, other, days) {
    const tbody = document.getElementById('dailyBreakdown');
    tbody.innerHTML = '';

    const fbDaily = fb / days;
    const googleDaily = google / days;
    const tiktokDaily = tiktok / days;
    const otherDaily = other / days;

    for (let i = 1; i <= Math.min(days, 30); i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Day ${i}</td>
            <td>${formatCurrency(fbDaily)}</td>
            <td>${formatCurrency(googleDaily)}</td>
            <td>${formatCurrency(tiktokDaily)}</td>
            <td>${formatCurrency(otherDaily)}</td>
            <td><strong>${formatCurrency(fbDaily + googleDaily + tiktokDaily + otherDaily)}</strong></td>
        `;
        tbody.appendChild(row);
    }
}

// Performance Data Generation
function generatePerformanceData() {
    const weeksCount = parseInt(document.getElementById('weeksCount').value) || 8;
    
    generateWeeklyData(weeksCount);
    generateDailyData();
    generateCampaignComparison();
}

function generateWeeklyData(weeks) {
    const tbody = document.getElementById('weeklyData');
    tbody.innerHTML = '';

    for (let i = 1; i <= weeks; i++) {
        const impressions = Math.floor(Math.random() * 50000) + 10000;
        const clicks = Math.floor(impressions * 0.025);
        const ctr = ((clicks / impressions) * 100).toFixed(2);
        const conversions = Math.floor(clicks * 0.035);
        const convRate = ((conversions / clicks) * 100).toFixed(2);
        const spend = Math.floor(Math.random() * 10000) + 5000;
        const revenue = conversions * 500;
        const roas = (revenue / spend).toFixed(2);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Week ${i}</td>
            <td>${formatNumber(impressions)}</td>
            <td>${formatNumber(clicks)}</td>
            <td>${ctr}%</td>
            <td>${formatNumber(conversions)}</td>
            <td>${convRate}%</td>
            <td>${formatCurrency(spend)}</td>
            <td>${formatCurrency(revenue)}</td>
            <td class="${roas >= 1 ? 'status-positive' : 'status-negative'}">${roas}x</td>
        `;
        tbody.appendChild(row);
    }
}

function generateDailyData() {
    const tbody = document.getElementById('dailyData');
    tbody.innerHTML = '';

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    days.forEach(day => {
        const impressions = Math.floor(Math.random() * 20000) + 5000;
        const clicks = Math.floor(impressions * 0.025);
        const spend = Math.floor(Math.random() * 2000) + 500;
        const revenue = clicks * 25;
        const status = revenue > spend ? '✓ Positive' : '✗ Negative';
        const statusClass = revenue > spend ? 'status-positive' : 'status-negative';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${day}</td>
            <td>${formatNumber(impressions)}</td>
            <td>${formatNumber(clicks)}</td>
            <td>${formatCurrency(spend)}</td>
            <td>${formatCurrency(revenue)}</td>
            <td class="${statusClass}">${status}</td>
        `;
        tbody.appendChild(row);
    });
}

function generateCampaignComparison() {
    const tbody = document.getElementById('campaignComparison');
    tbody.innerHTML = '';

    const campaigns = [
        { name: 'Campaign A', budget: 50000 },
        { name: 'Campaign B', budget: 35000 },
        { name: 'Campaign C', budget: 25000 },
        { name: 'Campaign D', budget: 40000 }
    ];

    campaigns.forEach(campaign => {
        const impressions = (campaign.budget / 5) * 1000;
        const clicks = Math.floor(impressions * 0.025);
        const conversions = Math.floor(clicks * 0.035);
        const revenue = conversions * 500;
        const roas = (revenue / campaign.budget).toFixed(2);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${campaign.name}</td>
            <td>${formatCurrency(campaign.budget)}</td>
            <td>${formatNumber(impressions)}</td>
            <td>${formatNumber(clicks)}</td>
            <td>${formatNumber(conversions)}</td>
            <td>${formatCurrency(revenue)}</td>
            <td class="${roas >= 1 ? 'status-positive' : 'status-negative'}">${roas}x</td>
        `;
        tbody.appendChild(row);
    });
}

// Chart Generation (using Canvas)
function generatePerformanceChart() {
    const canvas = document.getElementById('performanceChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Simple line chart implementation
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    canvas.width = width;
    canvas.height = height;

    // Generate sample data
    const dataPoints = [];
    for (let i = 0; i < 8; i++) {
        dataPoints.push(Math.floor(Math.random() * 100) + 20);
    }

    // Draw grid
    ctx.strokeStyle = 'rgba(45, 45, 68, 0.3)';
    ctx.lineWidth = 1;

    for (let i = 0; i < 5; i++) {
        const y = (height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Draw line chart
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const xStep = width / (dataPoints.length - 1);
    const yMax = Math.max(...dataPoints);

    dataPoints.forEach((point, index) => {
        const x = index * xStep;
        const y = height - (point / yMax) * (height * 0.8) - 20;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#ff006e';
    dataPoints.forEach((point, index) => {
        const x = index * xStep;
        const y = height - (point / yMax) * (height * 0.8) - 20;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Utility Functions
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
}

function formatCurrency(num) {
    return new Intl.NumberFormat('en-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(num);
}

function resetCalculator() {
    // Reset basic calculator
    document.getElementById('totalBudget').value = 50000;
    document.getElementById('cpm').value = 5;
    document.getElementById('ctr').value = 2.5;
    document.getElementById('conversionRate').value = 3.5;
    document.getElementById('aov').value = 500;

    // Reset advanced
    document.getElementById('duration').value = 30;
    document.getElementById('dailyBudget').value = 1500;
    document.getElementById('reach').value = 100000;

    // Reset budget allocation
    document.getElementById('marketingBudget').value = 100000;
    document.getElementById('facebookAlloc').value = 35;
    document.getElementById('googleAlloc').value = 30;
    document.getElementById('tiktokAlloc').value = 20;
    document.getElementById('otherAlloc').value = 15;

    calculateMetrics();
    calculateBudgetAllocation();
    generatePerformanceData();
}

function exportData() {
    const data = {
        basicCalculator: {
            totalBudget: document.getElementById('totalBudget').value,
            cpm: document.getElementById('cpm').value,
            ctr: document.getElementById('ctr').value,
            conversionRate: document.getElementById('conversionRate').value,
            aov: document.getElementById('aov').value,
            results: {
                impressions: document.getElementById('impressions').textContent,
                clicks: document.getElementById('clicks').textContent,
                conversions: document.getElementById('conversions').textContent,
                revenue: document.getElementById('revenue').textContent,
                roi: document.getElementById('roi').textContent
            }
        },
        exportDate: new Date().toLocaleString('en-EG')
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'media-buying-report.json';
    link.click();
}

// Theme Toggle
document.getElementById('themeToggle').addEventListener('click', function() {
    document.body.classList.toggle('light-mode');
    this.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    calculateMetrics();
    calculateBudgetAllocation();
    generatePerformanceData();
});