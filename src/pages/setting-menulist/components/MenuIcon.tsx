import React, { useState } from 'react';
import * as IconList from '@arco-design/web-react/icon/index.js';
import { Button } from '@arco-design/web-react';
import styles from '../style/index.module.less';

function MenuIcon({ MenuIconRef }) {
  const [icon, setIcon] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const res = [];
  Object.keys(IconList).map((key) => {
    const menu = {
      icon: React.createElement(IconList[key]),
    };
    res.push(menu);
  });
  function handleSelect(icon, index) {
    setCurrentIndex(index);
  }
  return (
    <div className={styles.iconlist}>
      {res.map((item, index) => {
        return (
          <div className={styles.icon} key={index}>
            <Button
              type={currentIndex == index ? 'primary' : 'default'}
              icon={item.icon}
              data-icon={item.icon}
              size="large"
              onClick={() => handleSelect(item.icon, index)}
            />
          </div>
        );
      })}
    </div>
  );
}
export default MenuIcon;
