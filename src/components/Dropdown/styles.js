import styled from "styled-components";

export const DropdownContainer = styled.div`
  /* display: flex;
  flex-direction: column;
  align-items: center; */

  button {
    background: #7159c1;
    border: 0;
    padding: 15px 15px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ul {
    list-style: none;
    position: absolute;

    li {
      background: #eee;
      padding: 5px 10px;

      &:hover {
        cursor: pointer;
        background: #7159c1;
      }

      span {
        margin-left: 10px;
      }
    }
  }
`;
