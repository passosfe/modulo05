import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Container from "../components/Container/index";
import Dropdown from "../components/Dropdown/index";
import { Loading, Owner, IssueList, FilterBar } from "./styles";
import api from "../services/api";

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string
      })
    }).isRequired
  };

  state = {
    repository: "",
    issues: [],
    loading: true,
    filter: "all",
    page: 1
  };

  async componentWillUpdate() {
    this.callAPI();
  }

  async componentDidMount() {
    this.callAPI();
  }

  callAPI = async () => {
    const { filter, page } = this.state;
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: filter,
          page: page
        }
      })
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false
    });
  };

  changeFilter = (e) => {
    const newFilter = e.currentTarget.textContent;

    if (newFilter !== this.state.filter) {
      this.setState({ filter: newFilter, page: 1 });
    }
  };

  render() {
    const { repository, issues, loading, filter } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos Repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <FilterBar>
          <hr />
          <Dropdown checked={filter} changeFilter={this.changeFilter} />
        </FilterBar>

        <IssueList>
          {issues.map((issue) => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map((label) => (
                    <span>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
      </Container>
    );
  }
}
