import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style/block.module.less';
import { Radio, Divider } from '@arco-design/web-react';
import { ReducerState } from '../../redux';
import useLocale from '../../utils/useLocale';
export default function MenuType(props: any) {
  const { title, options } = props;
  const settings = useSelector((state: ReducerState) => state.global.settings);
  const dispatch = useDispatch();
  const locale = useLocale();
  const RadioGroup = Radio.Group;
  const handleChangeMode = (value) => {
    const newSetting = {
      ...settings,
      menuMode: value,
    };
    dispatch({ type: 'update-settings', payload: { settings: newSetting } });
  };
  return (
    <div className={styles.block}>
      <h5 className={styles.title}>{title}</h5>
      <RadioGroup
        type="button"
        name="lang"
        size="large"
        onChange={handleChangeMode}
        value={settings.menuMode}
      >
        {options &&
          options.map((option) => {
            return (
              <Radio value={option.value} key={option.value}>
                {locale[option.name]}
              </Radio>
            );
          })}
      </RadioGroup>
      <Divider />
    </div>
  );
}
