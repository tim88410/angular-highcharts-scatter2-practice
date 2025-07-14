import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  chart!: Highcharts.Chart;
  selectedPointIndex: number | null = null;
  fixedTooltipVisible = false;
  fixedTooltipStyle = { top: '0px', left: '0px' };
  tooltipTimeout: any;
  isMouseOverTooltip = false;

  // points = Array.from({ length: 10 }, (_, i) => ({
  //   x: Math.floor(Math.random() * 100),
  //   y: Math.floor(Math.random() * 100),
  //   name: `Point ${i + 1}`,
  //   url: 'https://angular.io'
  // }));
  points = [
    {
        "x": 73,
        "y": 49,
        "name": "Point 1",
        "url": "https://angular.io"
    },
    {
        "x": 63,
        "y": 55,
        "name": "Point 2",
        "url": "https://angular.io"
    },
    {
        "x": 60,
        "y": 58,
        "name": "Point 3",
        "url": "https://angular.io"
    },
    {
        "x": 23,
        "y": 10,
        "name": "Point 4",
        "url": "https://angular.io"
    },
    {
        "x": 41,
        "y": 47,
        "name": "Point 5",
        "url": "https://angular.io"
    },
    {
        "x": 85,
        "y": 59,
        "name": "Point 6",
        "url": "https://angular.io"
    },
    {
        "x": 82,
        "y": 92,
        "name": "Point 7",
        "url": "https://angular.io"
    },
    {
        "x": 24,
        "y": 65,
        "name": "Point 8",
        "url": "https://angular.io"
    },
    {
        "x": 3,
        "y": 74,
        "name": "Point 9",
        "url": "https://angular.io"
    },
    {
        "x": 84,
        "y": 76,
        "name": "Point 10",
        "url": "https://angular.io"
    }
  ]

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.initChart();
  }

  ngOnDestroy() {
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }
    if (this.chart) {
      this.chart.destroy();
    }
  }

  initChart() {
    const self = this;

    this.chart = Highcharts.chart('container', {
      chart: {
        type: 'scatter',
        events: {
          click() {
            self.clearSelection();
          }
        }
      },
      title: { text: 'Scatter Chart with Fixed Tooltip' },
      xAxis: { title: { text: 'X Axis' } },
      yAxis: { title: { text: 'Y Axis' } },
      tooltip: { enabled: false },
      plotOptions: {
        scatter: {
          cursor: 'pointer',
          point: {
            events: {
              click(event) {
                event.stopPropagation();
                self.onPointClick(this);
              }
            }
          }
        }
      },
      series: [{
        type: 'scatter',
        point:{
          events:{
            mouseOver() {
              self.onPointHover(this);
            }
          }
        },
        data: this.points.map(p => [p.x, p.y]),
        marker: {
          radius: 6,
          symbol: 'circle'
        }
      }]
    });
  }

  onPointHover(point: any) {
    const chartPosition = this.chart.container.getBoundingClientRect();
    const pointPlotX = point.plotX;
    const pointPlotY = point.plotY;

    const offsetX = 20;
    const offsetY = 40;

    this.fixedTooltipStyle = {
      left: `${chartPosition.left + pointPlotX + offsetX}px`,
      top: `${chartPosition.top + pointPlotY - offsetY}px`
    };
    this.fixedTooltipVisible = true;
    this.selectedPointIndex = point.index;
  }

  onPointClick(point: any) {
    this.selectedPointIndex = point.index;

    const chartPosition = this.chart.container.getBoundingClientRect();
    const pointPlotX = point.plotX;
    const pointPlotY = point.plotY;
    const offsetX = 20;
    const offsetY = 40;

    this.fixedTooltipStyle = {
      left: `${chartPosition.left + pointPlotX + offsetX}px`,
      top: `${chartPosition.top + pointPlotY - offsetY}px`
    };

    this.fixedTooltipVisible = true;
  }

  clearSelection(force = false) {
    if (force || !this.isMouseOverTooltip) {
      this.selectedPointIndex = null;
      this.fixedTooltipVisible = false;
    }
  }

  onTooltipMouseEnter() {
    this.isMouseOverTooltip = true;
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }
  }

  onTooltipMouseLeave() {
    this.isMouseOverTooltip = false;
    this.tooltipTimeout = setTimeout(() => {
      this.clearSelection();
    }, 300);
  }
}
