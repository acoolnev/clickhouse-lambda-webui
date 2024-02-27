import React from 'react';
import { Divider } from "antd";


interface SectionDividerProps {
  name: string   
}

const SectionDivider : React.FC<SectionDividerProps> = ({
  name
}) => (
  <Divider
    orientation="left"
    orientationMargin={ 16 }
    style={{ margin: 8 }}
  >
    {name}
  </Divider>
);

export default SectionDivider;
