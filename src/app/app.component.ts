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

  points = Array.from({ length: 10 }, (_, i) => ({
    x: Math.floor(Math.random() * 100),
    y: Math.floor(Math.random() * 100),
    name: `Point ${i + 1}`,
    url: 'https://angular.io'
  }));

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
        data: this.points.map(p => [p.x, p.y]),
        marker: {
          radius: 6,
          symbol: 'circle'
        }
      }]
    });
  }

  onPointClick(point: any) {
    this.selectedPointIndex = point.index;

    const chartPosition = this.chart.container.getBoundingClientRect();
    const pointPlotX = point.plotX;
    const pointPlotY = point.plotY;

    this.fixedTooltipStyle = {
      left: `${chartPosition.left + pointPlotX + 10}px`,
      top: `${chartPosition.top + pointPlotY + 10}px`
    };
    this.fixedTooltipVisible = true;
  }

  clearSelection() {
    if (!this.fixedTooltipVisible) return;
    this.selectedPointIndex = null;
    this.fixedTooltipVisible = false;
  }

  onTooltipMouseEnter() {
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }
  }

  onTooltipMouseLeave() {
    console.log(this.points);
    this.tooltipTimeout = setTimeout(() => {
      this.clearSelection();
    }, 300);
  }
}
