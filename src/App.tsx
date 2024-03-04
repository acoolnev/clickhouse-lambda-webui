import React, { useState } from 'react';
import { Button, Flex, Input, Select, Typography } from 'antd';
import axios from 'axios';
import './index.css';
import PageLayout from './PageLayout';
import SectionDivider from './SectionDivider';
import formatBytes from './Utils';


const { Link, Paragraph, Text, Title } = Typography;
const { TextArea } = Input;

const App: React.FC = () => {

  const maxRequestSize : number = (() => {
    const size = parseInt(process.env.REACT_APP_CLICKHOUSE_LAMBDA_API_MAX_REQUEST_SIZE);
    // AWS HTTP APIs are metered in 512 KB increments. 
    return size > 0 ? size : (512 - 4) * 1024; // Reserve 4 KB for headers
  })();

  const inputFormats = ['CSV', 'TSV', 'Values', 'JSON', 'JSONEachRow'];
  const outputFormats = ['CSV', 'TSV', 'Values', 'JSON', 'JSONEachRow', 'SQLInsert', 'Vertical', 'PrettySpace'];

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

  const executeQuery = () => {

    if (queryText.length === 0)
    {
      setQueryResult('Query is not specified');
      return;
    }

    const request = JSON.stringify({
      clickHouse: {
        query: queryText,
        outputFormat: outputFormat,
        inputFormat: inputFormat,
        structure: inputStructure,
        data: inputData
      } }
    );

    if (request.length > maxRequestSize)
    {
      setQueryResult(`The request size ${formatBytes(request.length)} exceeds maximal amount ${formatBytes(maxRequestSize)}`);
      return;
    }

    axios.post(process.env.REACT_APP_CLICKHOUSE_LAMBDA_API_URL, request )
      .then(response => {
        if ('data' in response.data)
          setQueryResult(response.data.data);
        else if ('error' in response.data)
          setQueryResult(response.data.error);
        else
          throw new Error(`Unsupported response format: ${response.data}`);
      })
      .catch(error => {
        setQueryResult(`Error occurred while fetching data: ${error}`);
      });
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
          <Link href="https://clickhouse.com/docs/en/sql-reference" target="_blank">
            ClickHouse SQL Reference
          </Link>
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
              options={inputFormats.map((option, index) => (
                { value: option }
              ))}
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
            options={outputFormats.map((option, index) => (
              { value: option }
            ))}
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
