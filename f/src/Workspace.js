import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import AmisRender from "./AmisRender"
import { filter } from 'lodash'
import { Link } from "react-router-dom"
import { Col, Nav, Navbar, Row, Container } from "react-bootstrap"
import { toast } from "react-toastify"
import logo from "./166538.png"

class Workspace extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: {
                "$schema": "https://houtai.baidu.com/v2/schemas/page.json",
                "type": "page",
                "body": {
                    "type": "tpl",
                    "tpl": "Welcome Axe Mis Square"
                }
            },
            isSearching: false,
            projectData: {},
            pageData: []
        }
    }

    componentDidUpdate(prevProps) {
        const { location } = this.props
        if (location.search !== prevProps.location.search) {
            this.onRouteChanged()
        }
    }

    componentDidMount() {
        const { params } = this.props.match

        const url = new URL(`${process.env.REACT_APP_API_URL}/project/${params.id}`)

        this.setState({ isSearching: true })
        fetch(url)
            .then(res => res.json())
            .then(result => {
                if (result.statusCode === 200) {
                    this.setState({
                        projectData: result.data,
                        pageData: result.data.pages,
                        isSearching: false
                    }, () => this.onRouteChanged())
                } else {
                    this.setState({ isSearching: false }, () => toast.error(result.message))
                }
            })
            .catch(err => this.setState({ isSearching: false }, () => toast.error(err.message)))
    }


    onRouteChanged() {
        const { location } = this.props
        const { pageData } = this.state

        if (location.search) {
            const params = new URLSearchParams(location.search)
            const newData = filter(pageData, item => item.url === params.get('url'))[0].data
            this.setState({
                data: JSON.parse(newData)
            })
        } else {
            this.setState({
                data: {
                    "$schema": "https://houtai.baidu.com/v2/schemas/page.json",
                    "type": "page",
                    "body": {
                        "type": "tpl",
                        "tpl": "Welcome Axe Mis Square"
                    }
                }
            })
        }
    }

    render() {
        const { location } = this.props
        const { data, projectData, pageData, isSearching } = this.state

        return (
            <>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand>
                        <img
                            src={logo}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            alt="React Bootstrap logo"
                        />
                        {` ${projectData.name}`}
                    </Navbar.Brand>
                </Navbar>
                <Container fluid>
                    {isSearching ? <>Loading...</> : <></>}
                    <Row className="d-flex flex-wrap">
                        <Col md={2} className="common-height mt-2">
                            <Nav className="flex-column nav-pills">
                                <Nav.Item>
                                    <Nav.Link as={Link}
                                              to={{ pathname: location.pathname }}
                                              active={!location.search}>
                                        欢迎
                                    </Nav.Link>
                                </Nav.Item>
                                {pageData.map((menu, index) => (
                                    <Nav.Item key={index}>
                                        <Nav.Link as={Link}
                                                  to={{ pathname: location.pathname, search: `?url=${menu.url}` }}
                                                  active={location.search === `?url=${menu.url}`}>
                                            {menu.name}
                                        </Nav.Link>
                                    </Nav.Item>
                                ))}
                            </Nav>
                        </Col>
                        <Col md={10} className="common-height">
                            <AmisRender data={data}/>
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
}

export default withRouter(Workspace)