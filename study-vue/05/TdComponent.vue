<template>
    <td @click="onClickTd">{{cellData}}</td>
</template>

<script>
    export default {
        props: {
            cellData: String,
            rowIndex: Number,
            cellIndex: Number,
        },
        data() {
			return {

			};
        },
        computed:{ 
           
        },
		methods: {
            onClickTd() {
                if (this.cellData) return;
                
                const rootData = this.$root.$data;
                console.log('$root === ', rootData); //최상위 접근
                console.log('$parent === ', this.$parent.$data); //부모 접근

                //rootData.tableData[this.rowIndex][this.cellIndex] = rootData.turn; //array 값을 수정해도 화면이 갱신 안된다.
                this.$set(rootData.tableData[this.rowIndex], this.cellIndex, rootData.turn); //$set() 사용해서 화면 갱신
                
                let win = false;
                if (rootData.tableData[this.rowIndex][0] === rootData.turn && 
                    rootData.tableData[this.rowIndex][1] === rootData.turn && 
                    rootData.tableData[this.rowIndex][2] === rootData.turn) {
                    win = true;
                }
                if (rootData.tableData[0][this.cellIndex] === rootData.turn && 
                    rootData.tableData[1][this.cellIndex] === rootData.turn && 
                    rootData.tableData[2][this.cellIndex] === rootData.turn) {
                    win = true;
                }
                if (rootData.tableData[0][0] === rootData.turn && 
                    rootData.tableData[1][1] === rootData.turn && 
                    rootData.tableData[2][2] === rootData.turn) {
                    win = true;
                }
                if (rootData.tableData[0][2] === rootData.turn && 
                    rootData.tableData[1][1] === rootData.turn && 
                    rootData.tableData[2][0] === rootData.turn) {
                    win = true;
                }

                if (win) { // 이긴 경우: 3줄 달성
                    rootData.winner = rootData.turn;
                    rootData.turn = 'O';
                    rootData.tableData = [['', '', ''], ['', '', ''], ['', '', '']];
                } else { // 무승부
                    let all = true; // all이 true면 무승부라는 뜻
                    rootData.tableData.forEach((row) => { // 무승부 검사
                        row.forEach((cell) => {
                            if (!cell) {
                                all = false;
                            }
                        });
                    });

                    if (all) { // 무승부
                        rootData.winner = '';
                        rootData.turn = 'O';
                        rootData.tableData = [['', '', ''], ['', '', ''], ['', '', '']];
                    } else {
                        rootData.turn = rootData.turn === 'O' ? 'X' : 'O';
                    }
                }
            }
        },
        mounted() {
            //console.log('mounted');
        },
        beforeDestroy() {
            //console.log('beforeDestroy');
        }
    };
</script>

<style scoped>
    
</style>


