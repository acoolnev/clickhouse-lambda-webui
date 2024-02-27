import React, { useState } from 'react';
import { Button, Flex, Input, Select, Typography } from 'antd';
import './index.css';
import PageLayout from './PageLayout';
import SectionDivider from './SectionDivider';


const { Paragraph, Text, Title } = Typography;
const { TextArea } = Input;

const App: React.FC = () => {

  const [queryText, setQueryText] = useState('');
  const [inputFormat, setInputFormat] = useState('CSV');
  const [inputStructure, setInputStructure] = useState('');
  const [inputData, setInputData] = useState('');
  const [outputFormat, setOutputFormat] = useState('CSV');
  const [queryResult, setQueryResult] = useState('');

  const onQueryTextChange = (event) => {
    setQueryText(event.target.value);
  };

  const onInputFormatChange = (value) => {
    setInputFormat(value);
  };

  const onInputStructureChange = (event) => {
    setInputStructure(event.target.value);
  };

  const onInputDataChange = (event) => {
    setInputData(event.target.value);
  };

  const onOutputFormatChange = (value) => {
    setOutputFormat(value);
  };

  // TODO: Implement query handler that send request to API Gateway connected to Lambda
  const executeQuery = () => {
    setQueryResult(`Query: ${queryText}\nInput format: ${inputFormat}\nInput data: ${inputData}\nOutput format: ${outputFormat}\n`);
  };

  return  (
    <PageLayout
      header={
        <>
          <Title level={4}> Experimental ClickHouse Lambda Request Tool </Title>
          <Paragraph>
            <Text strong> Note: </Text> This is a demo application with limited functionality. To avoid extra costs,
            requesting data from external sources such as S3 parquet files is not allowed. Only data from
            <Text code> Input </Text> field can be used in queries. Additionally, no provisioned concurrency is
            configured for the lambda. As a result, the first request may be delayed due to lambda initialization,
            which can take about 5 seconds.
          </Paragraph>    
        </>
      }
      topLeftContent={
        <Flex gap="small" vertical align="flex-start">
          <SectionDivider name="Query"/>
          <TextArea
            placeholder="Query: SELECT * FROM table" allowClear
            value={queryText} onChange={onQueryTextChange}
          />
          <Button type="primary" onClick={executeQuery}>Run</Button>
        </Flex>
      }
      bottomLeftContent={
        <Flex gap="small" vertical style={{ height: '100%' }}>
          <SectionDivider name="Input"/>
          <Flex gap="small" align="flex-start">
            <Select
              style={{ width: 120 }}
              defaultValue="CSV"
              options={[
                { value: 'CSV', label: 'CSV' },
                { value: 'TSV', label: 'TSV' },
              ]}
              value={inputFormat} onChange={onInputFormatChange}
            />
            <Input placeholder="Structure: a int, b int" allowClear 
             value={inputStructure} onChange={onInputStructureChange}
            />
          </Flex>
          <TextArea
            placeholder="Data: 1,2" allowClear rows={5} style={{ height: '100%', resize: 'none' }}
            value={inputData} onChange={onInputDataChange}
          />
        </Flex>
      }
      rightContent={
        <Flex gap="small" vertical align="flex-start" style={{ height: '100%' }}>
          <SectionDivider name="Output"/>
          <Select
            defaultValue="CSV"
            style={{ width: 120 }}
            options={[
              { value: 'CSV', label: 'CSV' },
              { value: 'TSV', label: 'TSV' },
            ]}
            value={outputFormat} onChange={onOutputFormatChange}
          />
          <TextArea
            placeholder="Result" rows={3} style={{ height: '100%', resize: 'none' }}
            value={queryResult}
          />
        </Flex>
      }
      footer={
        <Paragraph>
          <Text strong> Disclaimer: </Text> This is not an official ClickHouse application and must not be associated
          with the ClickHouse company in any way.
        </Paragraph>
      }
    />
  );

};

export default App;
