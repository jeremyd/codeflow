import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { ListGroup, ListGroupItem, ListGroupItemHeading } from 'reactstrap'
import moment from 'moment'
import { fetchBookmarkCurrentRelease } from '../actions'
import { map, tap, isEqual } from 'lodash'

// if(feature.externalLink && feature.externalLink !== '' && feature.externalLink.startsWith('http')) {
//   return (<a href={feature.externalLink} target="_blank">{feature.hash.substring(0,8)}</a>)
// }

// return (<span>{feature.hash.substring(0,8)}</span>)

const getProjectIds = (bookmarks) => {
  return tap({}, (obj) => {
    map(bookmarks, 'projectId').forEach((projectId) => obj[projectId] = true)
  })
}

const renderFeatureHash = (feature) => {
  if(feature.externalLink && feature.externalLink !== '' && feature.externalLink.startsWith('http')) {
    return (<a href={feature.externalLink} target="_blank">{feature.hash.substring(0,8)}</a>)
  }

  return (<span>{feature.hash.substring(0,8)}</span>)
}

class DashboardReleases extends Component {
  componentWillMount() {

  }

  componentWillReceiveProps({bookmarks}) {
    const { bookmarks: currentBookmarks, fetchBookmarkCurrentRelease } = this.props

    const currentProjectIds = getProjectIds(currentBookmarks)
    const nextProjectIds = getProjectIds(bookmarks)

    if (isEqual(currentProjectIds, nextProjectIds)) {
      return
    }

    console.log("xxxxxxxxxxxxxxxxxxxxx")
    bookmarks.forEach(({slug}) => fetchBookmarkCurrentRelease({slug}))
  }

  componentWillUnmount() {
    // dismiss_releases

  }

  render() {
    const {bookmarks, bookmarkReleases} = this.props

    console.log(bookmarks)
    console.log(bookmarkReleases)

    // debugger

    bookmarks.forEach(({projectId}) => console.log(bookmarkReleases[projectId]))
    return (
      <div>
        <div className="hr-divider m-t-md m-b">
          <h3 className="hr-divider-content hr-divider-heading">Recent releases</h3>
        </div>
        <ListGroup>
          {bookmarks.map(({projectId, slug, name}) => <DashboardRelease key={projectId} projectName={name} projectSlug={slug} release={bookmarkReleases[projectId]} />)}
        </ListGroup>
      </div>
    )
  }
}

const mapStateToProps = ({bookmarks, bookmarkReleases}) => ({
  bookmarks,
  bookmarkReleases
})

const ConnectedDashboardReleases = connect(mapStateToProps, {
  fetchBookmarkCurrentRelease
})(DashboardReleases)

const DashboardRelease = ({projectName, projectSlug, release}) => {
  if (!release) {
    return null
  }

  return (
    <ListGroupItem>
      <div className="feed-element media-body">
        <div className="row">
          <div className="col-xs-12">
            <ListGroupItemHeading><Link to={`projects/${projectSlug}/deploy`}>{projectName}</Link></ListGroupItemHeading>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-10">
            <div className="row">
              <div className="col-xs-12">
                <i className="fa fa-code-fork" aria-hidden="true" /> <strong>
                   <i className="fa fa-angle-double-right" aria-hidden="true" /> { renderFeatureHash(release.tailFeature) } - {release.headFeature.message}
                </strong> <br/>
              </div>
              <div className="col-xs-12">
                <small className="text-muted">by <strong>{release.headFeature.user}</strong> {moment(release._created).fromNow() } - {moment(release._created).format('MMMM Do YYYY, h:mm:ss A')} </small>
              </div>
              <div className="col-xs-12">
              </div>
            </div>
          </div>
          <div className="col-xs-2 flex-xs-middle">
          </div>
        </div>
      </div>
    </ListGroupItem>
  )
}

// connect to bookmark releases by project id

export default ConnectedDashboardReleases
