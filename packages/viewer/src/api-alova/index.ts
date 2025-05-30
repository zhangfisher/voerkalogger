import { createAlova } from 'alova';
import fetchAdapter from 'alova/fetch';
import reactHook from 'alova/react';
import { createApis, withConfigType } from './createApis';

export const alovaInstance = createAlova({
  baseURL: '/api',
  statesHook: reactHook,
  requestAdapter: fetchAdapter(),
  beforeRequest: method => {},
  responded: res => {
    return res.json();
  }
});

export const $$userConfigMap = withConfigType({});

const Apis = createApis(alovaInstance, $$userConfigMap);

export default Apis;
