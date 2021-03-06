import {
  createStore,
  applyMiddleware,
  compose,
}                  from 'redux';

import injectClientAndGetMiddleware from 'redux/middlewares/promiseMiddleware';
import reducer                      from 'redux/reducer';

export default function configureStore(client, initialState) {
  const finalCreateStore = compose(
    applyMiddleware(injectClientAndGetMiddleware(client)),
    (typeof window !== 'undefined' && window.devToolsExtension) ? window.devToolsExtension() : f => f
  )(createStore);

  const store = finalCreateStore(reducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('redux/reducer', () => {
      const nextReducer = require('redux/reducer').default; // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
