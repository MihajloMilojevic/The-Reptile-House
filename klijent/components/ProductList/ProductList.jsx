import {ProductCard} from ".."

function ProductList({data, category}) {
	return (
		<div style={{
			display: "flex",
			flexWrap: "wrap",
			gap: "2rem",
			justifyContent: "center",
			alignItems: "center",
		}}>
			{
				data.map(item => (<ProductCard key={item.id} {...item} url={`/${category}/${item.id}`}/>))
			}
		</div>
	)
}

export default ProductList