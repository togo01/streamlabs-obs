import cx from 'classnames';
import BaseLayout, { LayoutProps, ILayoutSlotArray } from './BaseLayout';
import { createProps } from 'components/tsx-component';
import { Component } from 'vue-property-decorator';
import ResizeBar from 'components/shared/ResizeBar.vue';
import styles from './Layouts.m.less';

@Component({ props: createProps(LayoutProps) })
export default class FourByFour extends BaseLayout {
  async mounted() {
    this.mountResize();
    this.setMins(['1'], ['2', '3'], ['4', '5']);
  }
  destroyed() {
    this.destroyResize();
  }

  get vectors() {
    return ['1', ['2', '3'], ['4', '5']] as ILayoutSlotArray;
  }

  render() {
    return (
      <div class={styles.rows}>
        <div class={styles.cell} style={{ height: `calc(100% - ${this.bar1 + this.bar2}px)` }}>
          {this.$slots['1']}
        </div>
        <ResizeBar
          position="top"
          value={this.bar1}
          onInput={(value: number) => this.setBar('bar1', value)}
          onResizestart={() => this.resizeStartHandler()}
          onResizestop={() => this.resizeStopHandler()}
          max={this.calculateMax(this.mins.rest + this.bar2)}
          min={this.mins.bar1}
          reverse={true}
        />
        <div class={styles.segmented} style={{ height: `${this.bar1}px` }}>
          <div class={cx(styles.cell, styles.noTopPadding)}>{this.$slots['2']}</div>
          <div class={cx(styles.cell, styles.noTopPadding)}>{this.$slots['3']}</div>
        </div>
        <ResizeBar
          position="top"
          value={this.bar2}
          onInput={(value: number) => this.setBar('bar2', value)}
          onResizestart={() => this.resizeStartHandler()}
          onResizestop={() => this.resizeStopHandler()}
          max={this.calculateMax(this.mins.rest + this.mins.bar1)}
          min={this.mins.bar2}
          reverse={true}
        />
        <div class={styles.segmented} style={{ height: `${this.bar2}px`, padding: '0 8px' }}>
          <div class={cx(styles.cell, styles.noTopPadding)}>{this.$slots['4']}</div>
          <div class={cx(styles.cell, styles.noTopPadding)}>{this.$slots['5']}</div>
        </div>
      </div>
    );
  }
}
