import utilStyles from '../styles/utils.module.css';

export default function Custom404() {
  return (
  <div className={utilStyles.notFound}>
    <div>404 - 여기는 없는 페이지랍니다 🥲</div>
    <br/>
    <img height={250} width={400} src={'http://file3.instiz.net/data/file3/2018/02/02/7/3/d/73d01fed6800e80220afcd539c9f3840.gif'}/>
  </div>
  );
}