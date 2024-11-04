import { echartSetOption } from './echarts-utils';

const accrualactualbudgetbarInit = () => {
  const { getColor, getData } = window.phoenix.utils;
  const $leadConversionChartEl = document.querySelector(
    '.echart-accrual-actual-budget-bar'
  );

  const tooltipFormatter = (params = 'MMM DD') => {
    let tooltipItem = ``;
    params.forEach(el => {
      tooltipItem += `<div class='ms-1'>
          <h6 class="text-body-tertiary"><span class="fas fa-circle me-1 fs-10" style="color:${
            el.color
          }"></span>
            ${el.seriesName} : $${el.value.toLocaleString()}
          </h6>
        </div>`;
    });

    tooltipItem += `<div class='ms-1'>
        <h6 class="text-body-tertiary">
          <span class="fas fa-circle me-1 fs-10" style="color:black;"></span>
          Accrual : $${accrualdata[0].toLocaleString()}
        </h6>
      </div>`;

    return `<div>
              <p class='mb-2 text-body-tertiary'>
                ${params[0].axisValue}
              </p>
              ${tooltipItem}
            </div>`;
  };

  const budgetdata = [1487565];
  const accrualdata = [342344]; // accrual point for reference
  const actualdata = [750000];

  if ($leadConversionChartEl) {
    const userOptions = getData($leadConversionChartEl, 'echarts');
    const chart = window.echarts.init($leadConversionChartEl);

    const getDefaultOptions = () => ({
      color: [getColor('primary'), getColor('tertiary-bg')],
      tooltip: {
        trigger: 'axis',
        padding: [7, 10],
        backgroundColor: getColor('body-highlight-bg'),
        borderColor: getColor('border-color'),
        textStyle: { color: getColor('light-text-emphasis') },
        borderWidth: 1,
        transitionDuration: 0,
        axisPointer: {
          type: 'none'
        },
        formatter: params => tooltipFormatter(params),
        extraCssText: 'z-index: 1000'
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          show: true,
          interval: 3,
          showMinLabel: true,
          showMaxLabel: false,
          color: getColor('quaternary-color'),
          align: 'left',
          fontFamily: 'Nunito Sans',
          fontWeight: 400,
          fontSize: 12.8,
          margin: 10,
          formatter: value => `${value / 1000}k`
        },
        show: true,
        axisLine: {
          lineStyle: {
            color: getColor('tertiary-bg')
          }
        },
        axisTick: false,
        splitLine: {
          show: false
        }
      },
      yAxis: {
        data: [''], // Empty string to remove label
        type: 'category',
        axisPointer: { type: 'none' },
        axisTick: false,
        splitLine: {
          show: false
        },
        axisLine: { show: false },
        axisLabel: { show: false } // Hide y-axis label
      },
      series: [
        {
          name: 'Budget',
          type: 'bar',
          label: {
            show: true,
            position: budgetdata[0] - actualdata[0] > 100000 ? 'insideRight' : 'top',
            formatter: () => `$${budgetdata[0].toLocaleString()}`, // Display as currency
            color: getColor('white'),
            fontSize: 12.8,
            fontWeight: 700,
            padding: [4, 6]
          },
          emphasis: {
            disabled: true
          },
          showBackground: true,
          backgroundStyle: {
            color: getColor('body-highlight-bg')
          },
          barWidth: '60px', // Further increase bar thickness
          barGap: '-100%',
          data: budgetdata,
          itemStyle: {
            borderWidth: 4,
            color: getColor('secondary-bg'),
            borderColor: getColor('secondary-bg')
          }
        },
        {
          name: 'Actual Spend',
          type: 'bar',
          emphasis: {
            disabled: true
          },
          label: {
            show: true,
            position: 'insideRight', // Adjust position to be more to the right within the bar
            formatter: () => `$${actualdata[0].toLocaleString()}`, // Display as currency
            color: getColor('white'),
            fontWeight: 700,
            fontFamily: 'Nunito Sans',
            fontSize: 12.8,
            padding: [4, 6]
          },
          backgroundStyle: {
            color: getColor('body-highlight-bg')
          },
          barWidth: '60px', // Further increase bar thickness
          data: actualdata,
          itemStyle: {
            borderWidth: 4,
            color: getColor('primary-light'),
            borderColor: getColor('secondary-bg')
          },
          markLine: {
            symbol: 'none',
            lineStyle: {
              color: 'black',
              type: 'solid',
              width: 8,
            },
            label: {
              show: false // Hide accrual label on the mark line
            },
            data: [
              {
                xAxis: accrualdata[0] // Place the vertical line at the accrual value
              }
            ]
          }
        }
      ],
      grid: {
        right: 0,
        left: 0,
        bottom: 8,
        top: 0,
        containLabel: true
      },
      animation: false
    });

    echartSetOption(chart, userOptions, getDefaultOptions);
  }
};

export default accrualactualbudgetbarInit;
