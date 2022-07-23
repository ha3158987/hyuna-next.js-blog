import utilStyles from '../styles/utils.module.css';

export default function Custom404() {
  return (
  <div className={utilStyles.notFound}>
    <div>404 - 여기는 없는 페이지랍니다 🥲</div>
    <br/>
    <img height={250} width={400} src={'https://cdn.clien.net/web/api/file/F01/5727066/52a1f05856bd6.gif'}/>
  </div>
  );
}