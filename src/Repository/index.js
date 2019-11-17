import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  FaAngleLeft,
  FaAngleRight,
  FaFilter,
  FaCheck,
  FaCircle
} from "react-icons/fa";

import Container from "../components/Container/index";
import {
  Loading,
  Owner,
  IssueList,
  FilterBar,
  PageNavigation,
  DropdownContainer
} from "./styles";
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
    page: 1,
    lockedBack: true,
    lockedNext: false,
    showMenu: false,
    filters: ["all", "open", "closed"]
  };

  async componentDidMount() {
    this.handleCallAPI();
  }

  handleCallAPI = async () => {
    const { filter, page } = this.state;
    const { match } = this.props;

    const lockedBack = page === 1 ? true : false;

    this.setState({ lockedBack });

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: filter,
          page
        }
      })
    ]);

    const lockedNext = issues.data.length < 30 ? true : false;

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
      lockedNext
    });
  };

  showMenu = (e) => {
    e.preventDefault();

    this.setState({ showMenu: true }, () => {
      document.addEventListener("click", this.closeMenu);
    });
  };

  closeMenu = () => {
    this.setState({ showMenu: false }, () => {
      document.removeEventListener("click", this.closeMenu);
    });
  };

  handleChangeFilter = (e) => {
    const newFilter = e.currentTarget.textContent;

    if (newFilter !== this.state.filter) {
      this.setState({ filter: newFilter, page: 1 }, this.handleCallAPI);
    }
  };

  handlePageNavigation = (next) => {
    const { page } = this.state;

    this.setState({ page: page + next }, this.handleCallAPI);
  };

  render() {
    const {
      repository,
      issues,
      loading,
      filter,
      page,
      lockedBack,
      lockedNext,
      filters
    } = this.state;

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
          <DropdownContainer>
            <button onClick={this.showMenu}>
              <FaFilter color="#FFF" size={14} />
            </button>

            {this.state.showMenu ? (
              <ul>
                {filters.map((filterName) => (
                  <li
                    key={filterName}
                    name={filterName}
                    onClick={this.handleChangeFilter}
                  >
                    {filter === filterName ? (
                      <FaCheck color="black" size={10} />
                    ) : (
                      <FaCircle color="black" size={10} />
                    )}
                    <span>{filterName}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </DropdownContainer>
        </FilterBar>

        <PageNavigation>
          <button
            onClick={() => this.handlePageNavigation(-1)}
            disabled={lockedBack}
          >
            <FaAngleLeft color="#fff" size={14} />
          </button>
          <span>{page}</span>
          <button
            onClick={() => this.handlePageNavigation(1)}
            disabled={lockedNext}
          >
            <FaAngleRight color="#fff" size={14} />
          </button>
        </PageNavigation>

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

        <PageNavigation>
          <button
            onClick={() => this.handlePageNavigation(-1)}
            disabled={lockedBack}
          >
            <FaAngleLeft color="#fff" size={14} />
          </button>
          <span>{page}</span>
          <button
            onClick={() => this.handlePageNavigation(1)}
            disabled={lockedNext}
          >
            <FaAngleRight color="#fff" size={14} />
          </button>
        </PageNavigation>
      </Container>
    );
  }
}
