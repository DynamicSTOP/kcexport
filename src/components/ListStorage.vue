<template>
    <div class="listStorage">

        <!-- import export ship list db -->
        <!--<div class="row exportImport">-->
            <!--<button>export</button>-->
            <!--<button>import</button>-->
        <!--</div>-->

        <div class="shipTable">
            <div class="columns noHover">
                <div class="column">#</div>
                <div class="column">ship count</div>
                <div class="column">Short link</div>
                <div class="column">Comment</div>
                <div class="column">Delete</div>
            </div>
            <div class="columns" @click.once="open(list)" v-for="(list, i) in storedKCLists" :key="i">
                <div class="column">{{i+1}}</div>
                <div class="column">{{list.arrayShips.length}}</div>
                <div class="column">
                    <div v-if="list.listId"><router-link :to="{name:'ShipListShort',params:{'short':list.listId}}">short</router-link></div>
                    <div v-else><button @click.stop.once="shortifyKCList(i)">make short link</button></div>
                </div>
                <div class="column" @click.stop="edit(i)">{{ list.comment }}</div>
                <div class="column"><button @click.stop.once="remove(i)">delete</button></div>
            </div>
        </div>
    </div>
</template>


<script>
    import {mapGetters} from 'vuex';

    export default {
        computed:{
            ...mapGetters(['storedKCLists'])
        },
        methods:{
            shortifyKCList(index){
                this.$store.dispatch('shortifyKCList', index);
            },
            open(shipList){
                this.$store.commit('setCurrentKCList', shipList);
                this.$router.push({name:"ShipList"});
            },
            edit(i){
                console.log(`edit comment of ${i}`);
            },
            remove(index){
                this.$store.dispatch('removeKCList', index);
            }
        }
    }
</script>

<style lang="scss">
    .listStorage {
        margin: 30px 20px;
        .exportImport {
            margin-bottom: 20px;
        }

        .shipTable{
            > :nth-child(2n+1), > .noHover:hover{
                cursor:default;
                background: rgba(0, 0, 0, 0.2);
            }

            > :hover{
                cursor:pointer;
                background: rgba(255,255,255,0.4);
            }
        }
    }


</style>