import React, { Component } from "react";
import { FaFilter, FaCircle, FaCheck } from "react-icons/fa";

import { DropdownContainer } from "./styles";

export default class Dropdown extends Component {
  state = {
    showMenu: false
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

  render() {
    const filters = ["all", "open", "closed"];
    const { checked, changeFilter } = this.props;

    return (
      <DropdownContainer>
        <button onClick={this.showMenu}>
          <FaFilter color="#FFF" size={14} />
        </button>

        {this.state.showMenu ? (
          <ul>
            {filters.map((filterName) => (
              <li key={filterName} name={filterName} onClick={changeFilter}>
                {checked === filterName ? (
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
    );
  }
}
