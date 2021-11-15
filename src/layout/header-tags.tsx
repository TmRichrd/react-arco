import { Tabs } from "@arco-design/web-react"
import React, { useState } from "react"
import styles from "./style/layout.module.less"
const TabPane = Tabs.TabPane;
const initTabs = [...new Array(5)].map((x, i) => ({
  title: `Tab ${i + 1}`,
  key: `key${i + 1}`,
  content: `${i + 1}`,
}));
function HeaderTags() {
  const [tabs, setTabs] = useState(initTabs);
  const [activeTab, setActiveTab] = useState('key2');
  const handleDeleteTab = (key) => {
    const index = tabs.findIndex((x) => x.key === key);
    const newTabs = tabs.slice(0, index).concat(tabs.slice(index + 1))

    if (key === activeTab && index > -1 && newTabs.length) {
      setActiveTab(newTabs[index] ? newTabs[index].key : newTabs[index - 1].key)
    }

    if (index > -1) {
      setTabs(newTabs);
    }
  };
  return(
    <div className={styles.tags}>
      <Tabs type='capsule' className={styles.start} editable onDeleteTab={handleDeleteTab}>
        {tabs.map(t=>(<TabPane destroyOnHide key={t.key} title={t.title}></TabPane>))}
      </Tabs>
    </div>
  )
}
export default HeaderTags