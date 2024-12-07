import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartDataItem {
  month: string;
  penaltyFees: number;
}

interface ChartSeries {
  name: string;
  data: number[];
}

interface ChartOptions {
  chart: {
    type: string;
    height: number;
  };
  plotOptions: {
    bar: {
      horizontal: boolean;
      columnWidth: string;
      endingShape: string;
    };
  };
  dataLabels: {
    enabled: boolean;
  };
  stroke: {
    show: boolean;
    width: number;
    colors: string[];
  };
  xaxis: {
    categories: string[];
  };
  yaxis: {
    title: {
      text: string;
    };
  };
  fill: {
    opacity: number;
  };
  tooltip: {
    y: {
      formatter: (val: number) => string;
    };
  };
}

interface ChartState {
  series: ChartSeries[];
  options: ChartOptions;
}

const OverduePenaltyChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartState>({
    series: [
      { name: 'Số tiền phạt', data: [] },
    ],
    options: {
      chart: { type: 'bar', height: 350 },
      plotOptions: { bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' } },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ['transparent'] },
      xaxis: { categories: [] },
      yaxis: { title: { text: 'VNĐ' } },
      fill: { opacity: 1 },
      tooltip: {
        y: {
          formatter: (val: number) => {
            const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
            return VND.format(val);
          },
        },
      },
    },
  });

  // Map tên tháng tiếng Anh sang tiếng Việt
  const translateMonthToVietnamese = (month: string): string => {
    const monthsInVietnamese: { [key: string]: string } = {
      January: 'Tháng 1',
      February: 'Tháng 2',
      March: 'Tháng 3',
      April: 'Tháng 4',
      May: 'Tháng 5',
      June: 'Tháng 6',
      July: 'Tháng 7',
      August: 'Tháng 8',
      September: 'Tháng 9',
      October: 'Tháng 10',
      November: 'Tháng 11',
      December: 'Tháng 12',
    };
    return monthsInVietnamese[month] || month;
  };

  // Hàm sắp xếp tháng từ 1 đến 12
  const sortByMonthOrder = (data: ChartDataItem[]): ChartDataItem[] => {
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return data.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/OverduePenaltyChart');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data: ChartDataItem[] = await response.json();

        if (data && data.length > 0) {
          // Sắp xếp dữ liệu tháng theo thứ tự từ 1 đến 12
          const sortedData = sortByMonthOrder(data);

          const months = sortedData.map((item) => translateMonthToVietnamese(item.month));
          const penaltyFees = sortedData.map((item) => item.penaltyFees);

          setChartData((prevState) => ({
            ...prevState,
            series: [{ name: 'Số tiền phạt', data: penaltyFees }],
            options: {
              ...prevState.options,
              xaxis: { ...prevState.options.xaxis, categories: months },
            },
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 0 }}>Biểu đồ phạt theo thời gian quá hạn</h2>
      <div id="chart">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
          width="750px"
        />
      </div>
    </div>
  );
};

export default OverduePenaltyChart;
