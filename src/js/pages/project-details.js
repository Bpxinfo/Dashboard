import completedTaskChartInit from '../theme/charts/echarts/completed-task-chart';
import topCouponsChartInit from '../theme/charts/echarts/top-coupons-chart';
import accrualactualbudgetbarInit from '../theme/charts/echarts/accrualactualbudgetbar';
import projectStatusInit from '../theme/charts/echarts/projectstatusrings';
import milestonesGanttInit from '../theme/charts/echarts/milestones-gantt'


const { docReady } = window.phoenix.utils;
docReady(milestonesGanttInit);
docReady(completedTaskChartInit);
docReady(topCouponsChartInit);
docReady(accrualactualbudgetbarInit);
docReady(projectStatusInit);


