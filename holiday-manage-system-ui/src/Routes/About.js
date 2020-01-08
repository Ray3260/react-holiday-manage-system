import React from 'react';
import '../css/about.css';
class About extends React.Component{
  render(){
    return (
      <div className="about">
        <div id="stage">
          <div className="cube">
            <div className="front side"><img alt="" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1575450513033&di=798af4634de56fdd48ad91163f481bc6&imgtype=0&src=http%3A%2F%2Fe.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F4610b912c8fcc3cef70d70409845d688d53f20f7.jpg" /></div>
            <div className="back side"><img alt="" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1575450513030&di=57b8ff364619413f33835a7cc5877d37&imgtype=0&src=http%3A%2F%2Ff.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Fb151f8198618367aa7f3cc7424738bd4b31ce525.jpg" /></div>
            <div className="left side"><img alt="" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1575450513020&di=9b6b5428e5f700c313b6178edd339ff1&imgtype=0&src=http%3A%2F%2Fa.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F730e0cf3d7ca7bcbdaea9ab4b4096b63f724a89c.jpg" /></div>
            <div className="right side"><img alt="" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1575450645400&di=bb47950ad4e29acee45bda83568d0e0c&imgtype=0&src=http%3A%2F%2Fa.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F0e2442a7d933c895a90dc5efdb1373f082020036.jpg" /></div>
            <div className="top side"><img alt="" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1575450645398&di=ef96f915dedd365227c3027aaedcf426&imgtype=0&src=http%3A%2F%2Fe.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F11385343fbf2b211aff3aedfc08065380dd78e45.jpg" /></div>
            <div className="bottom side"><img alt="" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1575450645397&di=e68c89a1f0916cb7b3ddc11667635bf2&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Ff9198618367adab4cb9badea81d4b31c8601e4d4.jpg" /></div>
          </div>
        </div>
        <h2 className="text-center pt-4 mb-5">关于假期管理系统</h2>
        <section className="container">
          <h3>简介</h3>
          <hr/>
          <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </section>
        <section className="container">
          <h3>主要技术</h3>
          <hr />
          <div className="font-div container">
            <div className="d-flex justify-content-around">
              <div>react-router</div>
              <div className="font">jquery</div>
            </div>
            <div className="row justify-content-around">
              <div>bootstrap4</div>
              <div>springboot</div>
            </div>
            <div className="row justify-content-around">
              <div className="font">css</div>
              <div>react</div>
              <div className="font">mysql</div>
            </div>
          </div>
        </section>
        <section className="container">
          <h3>开发团队</h3>
          <hr />
        </section>
        <section className="container">
          <h3>联系我们</h3>
          <hr />
        </section>
      </div>
    );
  }
}
export default About;