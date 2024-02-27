import React, { ReactNode } from 'react';
import { Divider, Row, Col, Flex } from 'antd';

interface PageLayoutProps {
  header: ReactNode;
  topLeftContent: ReactNode;
  bottomLeftContent: ReactNode;
  rightContent: ReactNode;
  footer: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  header,
  topLeftContent,
  bottomLeftContent,
  rightContent,
  footer
}) => (
    <Flex vertical style={{height: '100vh' }}>
      <header> {header} </header>
      <Row gutter={[24, 24]} style={{height: '100%' }}>
        <Col xs={12} style={{height: '100%' }}>
          <Flex vertical style={{height: '100%' }}>
            {topLeftContent}
            {bottomLeftContent}
          </Flex>
        </Col>
        <Col xs={12} style={{height: '100%' }}>
          {rightContent}
        </Col>
      </Row>
      <Divider/>
      <footer> {footer} </footer>
    </Flex>
);

export default PageLayout;
