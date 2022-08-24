import {ProductCard} from ".."

function ProductList({data, category, refresh}) {
	return (
		<div style={{
			display: "flex",
			flexWrap: "wrap",
			gap: "2rem",
			justifyContent: "center",
			alignItems: "center",
		}}>
			{
				data.map(item => (<ProductCard refresh={refresh} key={item.id} {...item} category={category}/>))
			}
		</div>
	)
}

export default ProductList