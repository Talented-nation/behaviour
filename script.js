// Simulated Dummy Data
const dashboardData = {
    attendance: {
        overall: {
            value: '94.5%',
            chartType: 'doughnut',
            labels: ['غياب', 'حضور'],
            values: [5.5, 94.5],
            colors: ['#dc3545', '#28a745'] // Red for absent, Green for present
        },
        grade1: {
            value: '96%',
            chartType: 'doughnut',
            labels: ['غياب', 'حضور'],
            values: [5, 95],
            colors: ['#dc3545', '#28a745']
        },
        grade2: {
            value: '93%',
            chartType: 'doughnut',
            labels: ['غياب', 'حضور'],
            values: [7, 93],
            colors: ['#dc3545', '#28a745']
        },
        grade3: {
            value: '94%',
            chartType: 'doughnut',
            labels: ['غياب', 'حضور'],
            values: [6, 94],
            colors: ['#dc3545', '#28a745']
        }
    },
    absenteeism: {
        overall: {
            value: '5.5%', // Overall Absenteeism Rate
            chartType: 'bar',
            labels: ['الصف الأول', 'الصف الثاني', 'الصف الثالث'],
            values: [4, 7, 6], // Absenteeism rates by grade
            colors: ['#ffc107', '#ffc107', '#ffc107'] // Yellow for absenteeism
        },
        grade1: {
            value: '4%',
            chartType: 'bar',
            labels: ['غياب (مسموح به)', 'غياب (غير مسموح به)'],
            values: [2, 2],
            colors: ['#ffc107', '#fd7e14'] // Orange for unexcused
        },
        grade2: {
            value: '7%',
            chartType: 'bar',
            labels: ['غياب (مسموح به)', 'غياب (غير مسموح به)'],
            values: [3, 4],
            colors: ['#ffc107', '#fd7e14']
        },
        grade3: {
            value: '6%',
            chartType: 'bar',
            labels: ['غياب (مسموح به)', 'غياب (غير مسموح به)'],
            values: [2.5, 3.5],
            colors: ['#ffc107', '#fd7e14']
        }
    },
    behavior: {
        overall: {
            value: '8 حوادث/شهر', // Overall average incidents per month
            chartType: 'bar',
            labels: ['الصف الأول', 'الصف الثاني', 'الصف الثالث'],
            values: [3, 2, 3], // Incidents count by grade
            colors: ['#dc3545', '#dc3545', '#dc3545'] // Red for behavior
        },
        grade1: {
            value: '3 حوادث/شهر',
            chartType: 'doughnut',
            labels: ['مشاجرات', 'عدم احترام', 'تخريب'],
            values: [1, 1, 1],
            colors: ['#fd7e14', '#e83e8c', '#6f42c1'] // Different colors for incident types
        },
        grade2: {
            value: '2 حوادث/شهر',
            chartType: 'doughnut',
            labels: ['إزعاج', 'تأخر', 'خروج من الفصل'],
            values: [1, 0.5, 0.5],
            colors: ['#20c997', '#6610f2', '#e83e8c']
        },
        grade3: {
            value: '3 حوادث/شهر',
            chartType: 'doughnut',
            labels: ['تنمّر', 'رفض أوامر', 'تجاوزات لفظية'],
            values: [1, 1, 1],
            colors: ['#c1272d', '#007bff', '#ffc107']
        }
    }
};

let currentIndicatorType = 'attendance'; // Default active main indicator
let currentGrade = 'overall';            // Default active grade

const mainNavButtons = document.querySelectorAll('.main-nav-button');
const subNavButtons = document.querySelectorAll('.sub-nav-button');
const currentIndicatorTitle = document.getElementById('current-indicator-title');
const currentIndicatorValue = document.getElementById('current-indicator-value');
const ctx = document.getElementById('disciplineChart').getContext('2d');
let disciplineChart = null; // To hold our Chart.js instance

// Function to update the dashboard content and chart
function updateDashboard() {
    const data = dashboardData[currentIndicatorType][currentGrade];
    if (!data) {
        currentIndicatorTitle.textContent = 'لا توجد بيانات لهذا القسم.';
        currentIndicatorValue.textContent = '';
        if (disciplineChart) disciplineChart.destroy();
        return;
    }

    // Update heading
    let titleText = "";
    if (currentIndicatorType === 'attendance') {
        titleText = "نسب حضور الطالبات";
    } else if (currentIndicatorType === 'absenteeism') {
        titleText = "نسب غياب الطالبات";
    } else if (currentIndicatorType === 'behavior') {
        titleText = "الحوادث السلوكية";
    }
    if (currentGrade !== 'overall') {
        titleText += ` - الصف ${currentGrade.replace('grade', '')}`;
    } else {
         titleText += ` - إجمالي (جميع الصفوف)`;
    }
    currentIndicatorTitle.textContent = titleText;

    // Update value display
    currentIndicatorValue.textContent = data.value;

    // Destroy existing chart before creating a new one
    if (disciplineChart) {
        disciplineChart.destroy();
    }

    // Chart Configuration
    const chartConfig = {
        type: data.chartType,
        data: {
            labels: data.labels,
            datasets: [{
                label: getChartLabel(currentIndicatorType, currentGrade),
                data: data.values,
                backgroundColor: data.colors,
                borderColor: data.colors.length === 1 ? data.colors[0] : [], // Only for single color bars
                borderWidth: 1,
                hoverOffset: data.chartType === 'doughnut' ? 4 : 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { size: 14, family: 'Arial' }
                    }
                },
                title: {
                    display: true,
                    text: getChartTitle(currentIndicatorType, currentGrade),
                    font: { size: 16, family: 'Arial', weight: 'bold' }
                }
            },
            scales: getChartScales(currentIndicatorType, data.chartType)
        }
    };
    disciplineChart = new Chart(ctx, chartConfig);
}

// Helper function for chart labels
function getChartLabel(indicatorType, grade) {
    if (indicatorType === 'attendance') return 'النسبة المئوية للحضور';
    if (indicatorType === 'absenteeism') {
        return grade === 'overall' ? 'نسبة الغياب (%)' : 'توزيع الغياب (%)';
    }
    if (indicatorType === 'behavior') {
        return grade === 'overall' ? 'عدد الحوادث' : 'أنواع الحوادث';
    }
    return '';
}

// Helper function for chart titles
function getChartTitle(indicatorType, grade) {
    if (indicatorType === 'attendance') return `توزيع الحضور ${grade === 'overall' ? '' : 'للصف ' + grade.replace('grade', '')}`;
    if (indicatorType === 'absenteeism') return `معدلات الغياب ${grade === 'overall' ? 'حسب الصف' : 'للصف ' + grade.replace('grade', '')}`;
    if (indicatorType === 'behavior') return `الحوادث السلوكية ${grade === 'overall' ? 'حسب الصف' : 'للصف ' + grade.replace('grade', '')}`;
    return '';
}

// Helper function for chart scales (for bar charts)
function getChartScales(indicatorType, chartType) {
    if (chartType === 'bar') {
        return {
            y: {
                beginAtZero: true,
                max: indicatorType === 'absenteeism' ? 10 : (indicatorType === 'behavior' ? 5 : 100), // Max for Y-axis
                title: {
                    display: true,
                    text: indicatorType === 'absenteeism' ? 'النسبة المئوية (%)' : 'عدد الحوادث',
                    font: { size: 14, family: 'Arial' }
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'الفئة',
                    font: { size: 14, family: 'Arial' }
                }
            }
        };
    }
    return {}; // No specific scales for doughnut charts
}

// Add event listeners to main navigation buttons
mainNavButtons.forEach(button => {
    button.addEventListener('click', () => {
        mainNavButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentIndicatorType = button.getAttribute('data-indicator-type');
        // When changing main category, reset grade selection to 'overall'
        subNavButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('.sub-nav-button[data-grade="overall"]').classList.add('active');
        currentGrade = 'overall';
        updateDashboard();
    });
});

// Add event listeners to sub-navigation (grade) buttons
subNavButtons.forEach(button => {
    button.addEventListener('click', () => {
        subNavButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentGrade = button.getAttribute('data-grade');
        updateDashboard();
    });
});

// Initial load: display Attendance - Overall by default
updateDashboard();
