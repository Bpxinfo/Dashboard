import { months } from '../../data';
import { echartSetOption, tooltipFormatter } from './echarts-utils';

/* -------------------------------------------------------------------------- */
/*                     Echart Bar Member info                                 */
/* -------------------------------------------------------------------------- */
const { echarts } = window;

const returningCustomerChartInit = () => {
  const { getColor, getData } = window.phoenix.utils;

  const $returningCustomerChart = document.querySelector(
    '.echart-returning-customer'
  );

  if ($returningCustomerChart) {
    const userOptions = getData($returningCustomerChart, 'echarts');
    const chart = echarts.init($returningCustomerChart);
    const getDefaultOptions = () => ({
      color: getColor('body-highlight-bg'),
      legend: {
        data: [
          {
            name: 'Lead Time',
            icon: 'roundRect',
            itemStyle: {
              color: getColor('primary-light'),
              borderWidth: 0
            }
          },
          {
            name: 'Cycle Time',
            icon: 'roundRect',
            itemStyle: { color: getColor('info-lighter'), borderWidth: 0 }
          },
          {
            name: 'Average Resolution Time',
            icon: 'roundRect',
            itemStyle: { color: getColor('primary'), borderWidth: 0 }
          }
        ],

        right: 'right',
        width: '100%',
        itemWidth: 16,
        itemHeight: 8,
        itemGap: 20,
        top: 3,
        inactiveColor: getColor('quaternary-color'),
        inactiveBorderWidth: 0,
        textStyle: {
          color: getColor('body-color'),
          fontWeight: 600,
          fontFamily: 'Nunito Sans'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        },
        padding: [7, 10],
        backgroundColor: getColor('body-highlight-bg'),
        borderColor: getColor('border-color'),
        textStyle: { color: getColor('light-text-emphasis') },
        borderWidth: 1,
        transitionDuration: 0,
        formatter: tooltipFormatter,
        extraCssText: 'z-index: 1000'
      },
      xAxis: {
        type: 'category',
        data: months,
        show: true,
        boundaryGap: false,
        axisLine: {
          show: true,
          lineStyle: { color: getColor('tertiary-bg') }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          // interval: 1,
          showMinLabel: false,
          showMaxLabel: false,
          color: getColor('secondary-color'),
          formatter: value => value.slice(0, 3),
          fontFamily: 'Nunito Sans',
          fontWeight: 600,
          fontSize: 12.8
        },
        splitLine: {
          show: true,
          lineStyle: { color: getColor('secondary-bg'), type: 'dashed' }
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: false,
        axisLabel: {
          showMinLabel: true,
          showMaxLabel: true,
          color: getColor('secondary-color'),
          formatter: value => `${value}%`,
          fontFamily: 'Nunito Sans',
          fontWeight: 600,
          fontSize: 12.8
        },
        splitLine: {
          show: true,
          lineStyle: { color: getColor('secondary-bg') }
        }
      },
      series: [
        {
          name: 'Lead Time',
          type: 'line',
          data: [8, 12, 7, 15, 9, 10, 13, 11, 14, 8, 12, 10],
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 10,
          emphasis: {
            lineStyle: {
              width: 1
            }
          },
          lineStyle: {
            type: 'dashed',
            width: 1,
            color: getColor('primary-light')
          },
          itemStyle: {
            borderColor: getColor('primary-light'),
            borderWidth: 3
          },
          zlevel: 3
        },
        {
          name: 'Cycle Time',
          type: 'line',
          data: [5, 6, 4, 8, 7, 5, 9, 6, 5, 7, 8, 6],
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 10,
          emphasis: {
            lineStyle: {
              width: 1
            }
          },
          lineStyle: {
            width: 1,
            color: getColor('info-lighter')
          },
          itemStyle: {
            borderColor: getColor('info-lighter'),
            borderWidth: 3
          },
          zlevel: 2
        },
        {
          name: 'Average Resolution Time',
          type: 'line',
          data: [4, 7, 6, 5, 8, 9, 6, 7, 5, 6, 7, 8],
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 10,
          emphasis: {
            lineStyle: {
              width: 3
            }
          },
          lineStyle: {
            width: 3,
            color: getColor('primary')
          },
          itemStyle: {
            borderColor: getColor('primary'),
            borderWidth: 3
          },
          zlevel: 1
        }
      ],
      grid: { left: 0, right: 8, top: '14%', bottom: 0, containLabel: true }
    });
    echartSetOption(chart, userOptions, getDefaultOptions);
  }
};

export default returningCustomerChartInit;
