/* eslint-disable react/prop-types */

import {expect} from 'chai'
import React from 'react'
import {renderToString} from 'react-dom/server'
import {Router, Route, IndexRoute, match} from '../../src'

const getRenderedString = ({location = '/', withRoutes}) => {
  return new Promise(resolve => {
    match({routes: withRoutes, location}, (_, __, renderProps) =>
      resolve(renderToString(<Router {...renderProps} />))
    )
  })
}

describe.only('<IndexRoute>', () => {
  const Parent = ({children}) => <div>parent: {children}</div>
  const Child = () => <i>child</i>

  it("renders when its parent's URL matches exactly", async () => {
    const withRoutes = (
      <Route path="/" component={Parent}>
        <IndexRoute component={Child} />
      </Route>
    )
    const renderedString = await getRenderedString({withRoutes})

    expect(renderedString).to.equal('<div>parent: <i>child</i></div>')
  })

  describe('nested deeply in the route hierarchy', () => {
    it("renders when its parent's URL matches exactly", async () => {
      const withRoutes = (
        <Route path="/" component={Parent}>
          <IndexRoute component={Child} />
          <Route path="/test" component={Parent}>
            <IndexRoute component={Child} />
          </Route>
        </Route>
      )
      const renderedString = await getRenderedString({
        withRoutes,
        location: '/test'
      })

      expect(renderedString).to.equal(
        '<div>parent: <div>parent: <i>child</i></div></div>'
      )
    })

    it('renders when its parents combined pathes match', async () => {
      const withRoutes = (
        <Route path="/path" component={Parent}>
          <IndexRoute component={Child} />
          <Route path="test" component={Parent}>
            <IndexRoute component={Child} />
          </Route>
        </Route>
      )

      const renderedString = await getRenderedString({
        withRoutes,
        location: '/path/test'
      })

      expect(renderedString).to.equal(
        '<div>parent: <div>parent: <i>child</i></div></div>'
      )
    })

    it('renders when its parents combined pathes match, and its direct parent is path less', async () => {
      const withRoutes = (
        <Route path="/" component={Parent}>
          <Route component={Parent}>
            <Route component={Parent}>
              <Route path="deep" component={() => 'dont render this'} />
              <IndexRoute component={Child} />
            </Route>
          </Route>
        </Route>
      )

      const renderedString = await getRenderedString({
        withRoutes,
        location: '/'
      })

      expect(renderedString).to.equal(
        '<div>parent: <div>parent: <div>parent: <i>child</i></div></div></div>'
      )
    })
  })
})
