import React, { useState, useImperativeHandle, useEffect, forwardRef } from 'react';
import * as IconList from '@arco-design/web-react/icon/index.js';
import { Button } from '@arco-design/web-react';
import styles from '../style/index.module.less';

let MenuIcon = (_props,ref) => {
  // 抛出方法
  const [icon, setIcon] = useState(null);
  useImperativeHandle(ref,()=>({
    icon
  }))
  const [currentIndex, setCurrentIndex] = useState(-1);
  const res = [];
  Object.keys(IconList).map((key) => {
    const menu = {
      icon: React.createElement(IconList[key]),
    };
    res.push(menu);
  });
  function handleSelect(icons, index) {
    setCurrentIndex(index);
    setIcon(icons.type.displayName);
  }
  useEffect(() => {
    console.log(icon);
  }, [icon]);
  return (
    <div className={styles.iconlist}>
      {res.map((item, index) => {
        return (
          <div className={styles.icon} key={index}>
            <Button
              type={currentIndex == index ? 'primary' : 'default'}
              icon={item.icon}
              size="large"
              onClick={() => handleSelect(item.icon, index)}
            />
          </div>
        );
      })}
    </div>
  );
};
export default MenuIcon = forwardRef(MenuIcon);
