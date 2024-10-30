import {
    echartSetOption,
    handleTooltipPosition,
    tooltipFormatter
  } from './echarts-utils';
  
  const barLineMixedChartInit = () => {
    const { getColor, getData } = window.phoenix.utils;
    const $chartEl = document.querySelector('.echart-financial-line-bar');
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    if ($chartEl) {
      const userOptions = getData($chartEl, 'echarts');
      const chart = window.echarts.init($chartEl);
  
      fetch('./data/main_data.json')
        .then(response => response.json())
        .then(data => {
          const monthlyData = Array.from({ length: 12 }, () => ({
            budget: 0,
            actual: 0,
            accrual: 0
          }));
  
          for (let projectKey in data) {
            const project = data[projectKey];
            const startDate = new Date(project.P_Start_Date);
            const endDate = new Date(project.P_End_Date);
  
            for (let month = startDate.getMonth(); month <= endDate.getMonth(); month++) {
              monthlyData[month].budget += project.LT_Budget || 0;
              monthlyData[month].actual += project.LT_Actual || 0;
              monthlyData[month].accrual += project.LT_Accrual || 0;
            }
          }
  
          // Keep data as numbers for ECharts compatibility
          const budgetData = monthlyData.map(item => Math.round(item.budget));
          const actualData = monthlyData.map(item => Math.round(item.actual));
          const accrualData = monthlyData.map(item => Math.round(item.accrual));
  
          // Calculate max value rounded to the nearest million for the y-axis
          const maxVal = Math.ceil(Math.max(...budgetData, ...actualData, ...accrualData) / 1000000) * 1000000;
  
          const getDefaultOptions = () => ({
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                crossStyle: { color: getColor('quaternary-color') },
                label: {
                  show: true,
                  backgroundColor: getColor('tertiary-color'),
                  color: getColor('body-highlight-bg')
                }
              },
              padding: [7, 10],
              backgroundColor: getColor('body-highlight-bg'),
              borderColor: getColor('border-color'),
              textStyle: { color: getColor('light-text-emphasis') },
              borderWidth: 1,
              transitionDuration: 0,
              position: (...params) => handleTooltipPosition(params),
              formatter: params => {
                return params.map(el => `
                  <div class='ms-1'>
                    <h6 class="text-body-tertiary">
                      <span class="fas fa-circle me-1 fs-10" style="color:${el.color}"></span>
                      ${el.seriesName}: $${el.value.toLocaleString()}
                    </h6>
                  </div>
                `).join('');
              }
            },
            toolbox: {
              top: 0,
              feature: {
                dataView: { show: false },
                magicType: { show: true, type: ['bar', 'line'] },
                restore: { show: true },
                saveAsImage: { show: true }
              },
              iconStyle: { borderColor: getColor('tertiary-color'), borderWidth: 1 },
              emphasis: { iconStyle: { textFill: getColor('tertiary-color') } }
            },
            legend: {
              top: 40,
              data: ['Actual Spend', 'Accruals', 'Budget'],
              textStyle: { color: getColor('tertiary-color') }
            },
            xAxis: [
              {
                type: 'category',
                data: months,
                axisLabel: {
                  color: getColor('quaternary-color'),
                  formatter: value => value.slice(0, 3)
                },
                axisPointer: { type: 'shadow' },
                axisLine: {
                  show: true,
                  lineStyle: { color: getColor('tertiary-bg') }
                }
              }
            ],
            yAxis: {
              type: 'value',
              min: 0,
              max: maxVal,
              interval: 500000,
              axisLabel: {
                color: getColor('quaternary-color'),
                formatter: value => `$${(value / 1000000).toFixed(1)}M`
              },
              splitLine: {
                show: true,
                lineStyle: { color: getColor('secondary-bg') }
              }
            },
            series: [
              {
                name: 'Actual Spend',
                type: 'bar',
                data: actualData,
                itemStyle: { color: getColor('primary'), barBorderRadius: [3, 3, 0, 0] }
              },
              {
                name: 'Accruals',
                type: 'bar',
                data: accrualData,
                itemStyle: { color: getColor('info'), barBorderRadius: [3, 3, 0, 0] }
              },
              {
                name: 'Budget',
                type: 'line',
                data: budgetData,
                lineStyle: { color: getColor('warning') },
                itemStyle: {
                  color: getColor('body-highlight-bg'),
                  borderColor: getColor('warning'),
                  borderWidth: 2
                },
                symbol: 'circle',
                symbolSize: 10
              }
            ],
            grid: {
              right: 5,
              left: 5,
              bottom: 5,
              top: '23%',
              containLabel: true
            }
          });
  
          echartSetOption(chart, userOptions, getDefaultOptions);
        });
    }
  };
  
  export default barLineMixedChartInit;
  