import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

import { VoerkaPhone } from '../..';
const voerkaPhone = new VoerkaPhone({
  settings: {
    app: {
      plugin: true,
      rootId: 'voerka-phone',
    },
  },
});
voerkaPhone.start();

{
  /* <script src="vokeracalling" type="module">
  import 
</script>
<script>
  new VoerkaPhone()
</script> */
}
