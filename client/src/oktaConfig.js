/*
 * Copyright (c) 2018-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

const CLIENT_ID = process.env.REACT_APP_OKTA_CLIENT_ID || '';
const ISSUER = process.env.REACT_APP_OKTA_ISSUER || '';
const OKTA_TESTING_DISABLEHTTPSCHECK = process.env.REACT_APP_OKTA_TESTING_DISABLEHTTPSCHECK || false;
const BASENAME = process.env.REACT_APP_PUBLIC_URL || '';
const REDIRECT_URI = `${window.location.origin}${BASENAME}/login/callback`;

const oktaConfig = {
  devMode: process.env.NODE_ENV === 'development',
  clientId: CLIENT_ID,
  issuer: ISSUER,
  redirectUri: REDIRECT_URI,
  scopes: ['openid', 'profile', 'email', 'offline_access'],
  pkce: true,
  disableHttpsCheck: OKTA_TESTING_DISABLEHTTPSCHECK,
  app: {
    basename: BASENAME
  },
  services: {
    autoRenew: true
  }
};

export default oktaConfig;