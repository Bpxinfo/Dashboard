(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  // import * as echarts from 'echarts';
  const { merge } = window._;

  // form config.js
  const echartSetOption = (
    chart,
    userOptions,
    getDefaultOptions,
    responsiveOptions
  ) => {
    const { breakpoints, resize } = window.phoenix.utils;
    const handleResize = options => {
      Object.keys(options).forEach(item => {
        if (window.innerWidth > breakpoints[item]) {
          chart.setOption(options[item]);
        }
      });
    };

    const themeController = document.body;
    // Merge user options with lodash
    chart.setOption(merge(getDefaultOptions(), userOptions));

    const navbarVerticalToggle = document.querySelector(
      '.navbar-vertical-toggle'
    );
    if (navbarVerticalToggle) {
      navbarVerticalToggle.addEventListener('navbar.vertical.toggle', () => {
        chart.resize();
        if (responsiveOptions) {
          handleResize(responsiveOptions);
        }
      });
    }

    resize(() => {
      chart.resize();
      if (responsiveOptions) {
        handleResize(responsiveOptions);
      }
    });
    if (responsiveOptions) {
      handleResize(responsiveOptions);
    }

    themeController.addEventListener(
      'clickControl',
      ({ detail: { control } }) => {
        if (control === 'phoenixTheme') {
          chart.setOption(window._.merge(getDefaultOptions(), userOptions));
        }
        if (responsiveOptions) {
          handleResize(responsiveOptions);
        }
      }
    );
  };
  // -------------------end config.js--------------------

  const echartTabs = document.querySelectorAll('[data-tab-has-echarts]');
  if (echartTabs) {
    echartTabs.forEach(tab => {
      tab.addEventListener('shown.bs.tab', e => {
        const el = e.target;
        const { hash } = el;
        const id = hash || el.dataset.bsTarget;
        const content = document.getElementById(id.substring(1));
        const chart = content?.querySelector('[data-echart-tab]');
        if (chart) {
          window.echarts.init(chart).resize();
        }
      });
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                             Echarts Total Sales                            */
  /* -------------------------------------------------------------------------- */

  const completedTaskChartInit = () => {
    const { getColor, getData, getDates } = window.phoenix.utils;

    const $totalSalesChart = document.querySelector(
      '.echart-completed-task-chart'
    );

    const dates = getDates(
      new Date('5/1/2022'),
      new Date('5/30/2022'),
      1000 * 60 * 60 * 24
    );

    const currentMonthData = [
      50, 115, 180, 180, 180, 150, 120, 120, 120, 120, 120, 240, 240, 240, 240,
      270, 300, 330, 360, 390, 340, 290, 310, 330, 350, 320, 290, 330, 370, 350
    ];

    const prevMonthData = [
      130, 130, 130, 90, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 110, 170,
      230, 230, 230, 270, 310, 270, 230, 260, 290, 320, 280, 280, 280
    ];
    const tooltipFormatter = params => {
      const currentDate = window.dayjs(params[0].axisValue);
      const prevDate = window.dayjs(params[0].axisValue).subtract(1, 'month');

      const result = params.map((param, index) => ({
        value: param.value,
        date: index > 0 ? prevDate : currentDate,
        color: param.color
      }));

      let tooltipItem = ``;
      result.forEach((el, index) => {
        tooltipItem += `<h6 class="fs-9 text-body-tertiary ${
        index > 0 && 'mb-0'
      }"><span class="fas fa-circle me-2" style="color:${el.color}"></span>
      ${el.date.format('MMM DD')} : ${el.value}
    </h6>`;
      });
      return `<div class='ms-1'>
              ${tooltipItem}
            </div>`;
    };

    if ($totalSalesChart) {
      const userOptions = getData($totalSalesChart, 'echarts');
      const chart = window.echarts.init($totalSalesChart);

      const getDefaultOptions = () => ({
        color: [getColor('primary'), getColor('info')],
        tooltip: {
          trigger: 'axis',
          padding: 10,
          backgroundColor: getColor('body-highlight-bg'),
          borderColor: getColor('border-color'),
          textStyle: { color: getColor('light-text-emphasis') },
          borderWidth: 1,
          transitionDuration: 0,
          axisPointer: {
            type: 'none'
          },
          formatter: tooltipFormatter,
          extraCssText: 'z-index: 1000'
        },
        xAxis: [
          {
            type: 'category',
            data: dates,
            axisLabel: {
              formatter: value => window.dayjs(value).format('DD MMM'),
              interval: 13,
              showMinLabel: true,
              showMaxLabel: false,
              color: getColor('secondary-color'),
              align: 'left',
              fontFamily: 'Nunito Sans',
              fontWeight: 600,
              fontSize: 12.8
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: getColor('secondary-bg')
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              interval: 0,
              lineStyle: {
                color: getColor('secondary-bg')
              }
            },
            boundaryGap: false
          },
          {
            type: 'category',
            position: 'bottom',
            data: dates,
            axisLabel: {
              formatter: value => window.dayjs(value).format('DD MMM'),
              interval: 130,
              showMaxLabel: true,
              showMinLabel: false,
              color: getColor('secondary-color'),
              align: 'right',
              fontFamily: 'Nunito Sans',
              fontWeight: 600,
              fontSize: 12.8
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            boundaryGap: false
          }
        ],
        yAxis: {
          position: 'right',
          axisPointer: { type: 'none' },
          axisTick: 'none',
          splitLine: {
            show: false
          },
          axisLine: { show: false },
          axisLabel: { show: false }
        },
        series: [
          {
            name: 'd',
            type: 'line',
            // data: Array.from(Array(30).keys()).map(() =>
            //   getRandomNumber(100, 300)
            // ),
            data: currentMonthData,
            showSymbol: false,
            symbol: 'circle'
          },
          {
            name: 'e',
            type: 'line',
            // data: Array.from(Array(30).keys()).map(() =>
            //   getRandomNumber(100, 300)
            // ),
            data: prevMonthData,
            // symbol: 'none',
            lineStyle: {
              type: 'dashed',
              width: 1,
              color: getColor('info')
            },
            showSymbol: false,
            symbol: 'circle'
          }
        ],
        grid: {
          right: 2,
          left: 5,
          bottom: '20px',
          top: '2%',
          containLabel: false
        },
        animation: false
      });

      echartSetOption(chart, userOptions, getDefaultOptions);
    }
  };

  // import * as echarts from 'echarts';

  const { echarts } = window;

  /* -------------------------------------------------------------------------- */
  /*                                Market Share                                */
  /* -------------------------------------------------------------------------- */

  const topCouponsChartInit = () => {
    const { getData, getColor } = window.phoenix.utils;
    const ECHART_TOP_COUPONS = '.echart-top-coupons';
    const $echartTopCoupons = document.querySelector(ECHART_TOP_COUPONS);

    if ($echartTopCoupons) {
      const userOptions = getData($echartTopCoupons, 'options');
      const chart = echarts.init($echartTopCoupons);

      const getDefaultOptions = () => ({
        color: [
          getColor('primary'),
          getColor('primary-lighter'),
          getColor('info-dark')
        ],

        tooltip: {
          trigger: 'item',
          padding: [7, 10],
          backgroundColor: getColor('body-highlight-bg'),
          borderColor: getColor('border-color'),
          textStyle: { color: getColor('light-text-emphasis') },
          borderWidth: 1,
          transitionDuration: 0,
          position(pos, params, el, elRect, size) {
            const obj = { top: pos[1] - 35 }; // set tooltip position over 35px from pointer
            if (window.innerWidth > 540) {
              if (pos[0] <= size.viewSize[0] / 2) {
                obj.left = pos[0] + 20; // 'move in right';
              } else {
                obj.left = pos[0] - size.contentSize[0] - 20;
              }
            } else {
              obj[pos[0] < size.viewSize[0] / 2 ? 'left' : 'right'] = 0;
            }
            return obj;
          },
          formatter: params => {
            return `<strong>${params.data.name}:</strong> ${params.percent}%`;
          },
          extraCssText: 'z-index: 1000'
        },
        legend: { show: false },
        series: [
          {
            name: '72%',
            type: 'pie',
            radius: ['100%', '87%'],
            avoidLabelOverlap: false,
            emphasis: {
              scale: false,
              itemStyle: {
                color: 'inherit'
              }
            },
            itemStyle: {
              borderWidth: 2,
              borderColor: getColor('body-bg')
            },
            label: {
              show: true,
              position: 'center',
              formatter: '{a}',
              fontSize: 23,
              color: getColor('light-text-emphasis')
            },
            data: [
              { value: 7200000, name: 'Percentage discount' },
              { value: 1800000, name: 'Fixed card discount' },
              { value: 1000000, name: 'Fixed product discount' }
            ]
          }
        ],
        grid: { containLabel: true }
      });

      echartSetOption(chart, userOptions, getDefaultOptions);
    }
  };

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

  const projectStatusInit = () => {
    const { getColor, getData } = window.phoenix.utils;
    const $chartEl = document.querySelector(
      '.echart-project-status'
    );

    if ($chartEl) {
      const userOptions = getData($chartEl, 'echarts');
      const chart = window.echarts.init($chartEl);
      const getDefaultOptions = () => ({
        series: [
          {
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            radius: '85%',
            pointer: {
              show: false
            },
            center: ['50%', '50%'],
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                color: getColor('info')
              }
            },
            axisLine: {
              lineStyle: {
                width: 8,
                color: [[1, getColor('secondary-bg')]]
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            data: [79],
            detail: {
              show: false
            },
            animationDuration: 2000
          },
          {
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            radius: '70%',
            pointer: {
              show: false
            },
            center: ['50%', '50%'],
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                color: getColor('primary')
              }
            },
            axisLine: {
              lineStyle: {
                width: 8,
                color: [[1, getColor('secondary-bg')]]
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            data: [85],
            detail: {
              show: false
            },
            animationDuration: 2000
          },
          {
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            radius: '55%',
            pointer: {
              show: false
            },
            center: ['50%', '50%'],
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                color: getColor('success')
              }
            },
            axisLine: {
              lineStyle: {
                width: 8,
                color: [[1, getColor('secondary-bg')]]
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            data: [70],
            detail: {
              show: false
            },
            animationDuration: 2000
          }
        ]
      });
      echartSetOption(chart, userOptions, getDefaultOptions);
    }
  };

  const { docReady } = window.phoenix.utils;
  docReady(completedTaskChartInit);
  docReady(topCouponsChartInit);
  docReady(accrualactualbudgetbarInit);
  docReady(projectStatusInit);

}));
//# sourceMappingURL=project-details.js.map
