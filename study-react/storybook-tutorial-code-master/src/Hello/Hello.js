import React from 'react';
import PropTypes from 'prop-types';

//컴포넌트의 설명
/**
 * 안녕하세요 라고 보여주고 싶을 땐 `Hello` 컴포넌트를 사용하세요.
 *
 * - `big` 값을 `true`로 설정하면 **크게** 나타납니다.
 * - `onHello` 와 `onBye` props로 설정하여 버튼이 클릭했을 때 호출 할 함수를 지정 할 수 있습니다.
 */
const Hello = ({ name, big, onHello, onBye }) => {
  return (
    <div>
      {big ? <h1>안녕하세요, {name}!</h1> : <p>안녕하세요, {name}!</p>}
      <div>
        <button onClick={onHello}>Hello</button>
        <button onClick={onBye}>Bye</button>
      </div>
    </div>
  );
}

//Docs 애드온은 MDX 형식으로 문서를 작성 할 수 있게 해주고, 컴포넌트의 props와 주석에 기반하여 자동으로 아주 멋진 문서를 자동생성해줍니다.
Hello.propTypes = {
  /** 보여주고 싶은 이름 */
  name: PropTypes.string.isRequired,
  /** 이 값을 `true` 로 설정하면 h1 태그로 렌더링 됩니다. */
  big: PropTypes.bool,
  /** Hello 버튼 누를 때 호출할 함수 */
  onHello: PropTypes.func,
  /** Bye 버튼 누를 때 호출할 함수 */
  onBye: PropTypes.func
};

Hello.defaultProps = {
  big: false
};

export default Hello;