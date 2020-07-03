/**
 * 页面TABS
 *
 * 接收参数：
 * viewName: 模块的名称，比如：预付款；合同；客户
 * viewCode: 模块的编号字段，比如合同模块的编号为contractNo
 * ListComponent: 显示列表页的组件
 * ViewComponent: 显示新建、详情、编辑页的组件
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'choerodon-ui/pro';
import { $l } from '@choerodon/boot';

const { TabPane } = Tabs;

let newTabIndex = 0;
const mainTabKey = 'list';

class PageTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeKey: mainTabKey,
      panes: [],
    };
  }

  /**
   * 更改当前选择tab页
   * @param activeKey
   */
  onChange = (activeKey) => {
    this.setState({ activeKey });
  };

  /**
   * tab页编辑操作
   * @param targetKey
   * @param action
   */
  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  /**
   * 移除tab页
   * @param targetKey
   */
  remove = (targetKey) => {
    const { panes } = this.state;
    let { activeKey } = this.state;
    let lastIndex = 0;
    targetKey = typeof targetKey === 'string' ? targetKey : activeKey;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = newPanes[lastIndex].key;
    } else {
      activeKey = mainTabKey;
    }
    this.setState({ panes: newPanes, activeKey });
  };

  /**
   * 新建tab页
   * @param type
   * @param record
   */
  createTabPane = (type = 'add', record) => {
    let title;
    const { panes } = this.state;
    if (type !== 'add') {
      let flag = false;
      panes.forEach((pane) => {
        if (pane.record && (pane.record.data[this.props.viewCode] === record.data[this.props.viewCode]) && (pane.type === type)) {
          this.setState({ activeKey: pane.key });
          flag = true;
        }
      });
      if (flag) {
        return;
      }
    }
    if (type === 'add') {
      title = `${$l('hap.new')}${this.props.viewName}`;
    } else if (type === 'edit') {
      title = `${$l('hap.edit')}_${record.data[this.props.viewCode]}`;
    } else {
      title = `${$l('hap.view')}_${record.data[this.props.viewCode]}`;
    }
    const activeKey = `newTab${newTabIndex += 1}`;
    panes.push({
      title,
      closable: true,
      key: activeKey,
      type,
      record,
    });
    this.setState({ panes, activeKey });
  };

  /**
   * 更改页面状态
   * @param type
   * @param idx
   * @param record
   */
  changePaneStatus = (type, idx, record) => {
    let title;
    if (type === 'add') {
      title = `${$l('hap.new')}${this.props.viewName}`;
    } else if (type === 'edit') {
      title = `${$l('hap.edit')}_${record.data[this.props.viewCode]}`;
    } else {
      title = `${$l('hap.view')}_${record.data[this.props.viewCode]}`;
    }
    this.setState((prevState) => {
      prevState.panes[idx].title = title;
      prevState.panes[idx].type = type;
      return { panes: prevState.panes };
    });
    this.forceUpdate();
  };

  render() {
    const { activeKey, panes } = this.state;

    const { ListComponent, ViewComponent, viewName } = this.props;

    return (
      <Tabs type="editable-card" activeKey={activeKey} onChange={this.onChange} onEdit={this.onEdit}>
        <TabPane tab={`${viewName}${$l('hap.list')}`} key={mainTabKey} closable={false}>
          <ListComponent createTabPane={(type, record) => this.createTabPane(type, record)} />
        </TabPane>
        {
          panes.map((pane, index) => (
            <TabPane tab={pane.title} closable={pane.closable} key={pane.key}>
              <ViewComponent
                remove={() => this.remove()}
                changePaneStatus={(type, record) => this.changePaneStatus(type, index, record)}
                type={pane.type}
                record={pane.record}
              />
            </TabPane>
          ))
        }
      </Tabs>
    );
  }
}
//
// PageTabs.propTypes = {
//   name: PropTypes.string.isRequired(),
//   viewCode: PropTypes.string.isRequired(),
//   listComponent: PropTypes.element.isRequired(),
//   viewComponent: PropTypes.element,
// };

export default PageTabs;
