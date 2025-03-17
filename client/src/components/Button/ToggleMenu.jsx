import React from 'react'; 
import { Button  } from "antd";
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons'
const ToggleMenu = ({collapsed , toggleCollapsed}) => {
    
  return (
      <>
          <Button
          type="primary"
          onClick={toggleCollapsed}
          className=''
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </>
  )
}

export default ToggleMenu