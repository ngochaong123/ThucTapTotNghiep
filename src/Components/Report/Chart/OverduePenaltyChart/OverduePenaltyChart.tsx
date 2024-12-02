import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartDataItem {
  month: string;
  penaltyFees: number; // Đặt lại đúng tên trường dữ liệu
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/OverduePenaltyChart');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data: ChartDataItem[] = await response.json();

        if (data && data.length > 0) {
          const months = data.map((item) => item.month);
          const penaltyFees = data.map((item) => item.penaltyFees);

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
