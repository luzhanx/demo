

var CityC = {
    data: function () {
        return {
            getData: [],    // 数据源
            xuanz: '',
            result: '',
            config: {
                multiple: 0, // 设置单双选    0 全选 1单选
                level: 3, // 设置显示几级城市  1为省份 2为市区 3为县区 
                active: '#5b5db9',
                Hactive: '#5b5db9',
                height: '200px'
            },
            cityComponent: false,    // 显示组件
        }
    },
    
    methods: {
        // 暴露方法

        // 显示组件
        show() {
            this.cityComponent = true;
        },
        // 隐藏组件
        hide() {
            this.cityComponent = false;
        },
        // 切换组件状态
        toggle() {
            this.cityComponent = !this.cityComponent;
        },
        // 获取选中值
        getChooseNames() {
            return this.__result().toString();
        },
        // 获取选中id
        getChooseIds() {
            return this.xuanz;
        },
        /**
         * 设置选中项
         * @param {String} 1,2,3
         */
        setChoose(ids) {
            this.xuanz = ids;
            this.init();
        },
        // 设置数据源
        setData(data) {
            this.getData = data;
            this.init();
        },
        /**
         * 设置单双选
         *  @param {Number} 0全选 1单选 
         **/
        setMultiple(multiple) {
            this.config.multiple = multiple;
            this.init();
        },
        /**
         * 设置显示几级城市
         * @param {Number} 1为省份 2为市区 3为县区 
         */
        setLevel(level) {
            this.config.level = level;
            this.init();
        },
        /**
         * 设置选中颜色
         * @param {String} 颜色
         */
        setActive(color) {
            this.config.active = color;
        },

        /**
         * 设置标题高亮颜色
         * @param {String} 颜色
         */
        setHactive(color) {
            this.config.Hactive = color;
        },

        /**
         * 设置组件高度
         *  @param {String}  高度
         **/
        setMultiple(height) {
            this.config.height = height;
        },





        // 初始化格式数据
        init() {
            const level = this.config.level;
            let that = this;
            let getData = [];

            switch (level) {
                case 1:
                    getData = this.getData.map(item => {
                        return {
                            id: item.id,
                            name: item.name,
                            active: this.xuanz.split(',').indexOf(`${item.id}`) !== -1 ? true : false
                        }
                    })
                    break;
                case 2:
                    getData = this.getData.map(item => {
                        return {
                            id: item.id,
                            name: item.name,
                            children: item.children && item.children.map(children => {
                                return {
                                    id: children.id,
                                    name: children.name,
                                    active: this.xuanz.split(',').indexOf(`${children.id}`) !== -1 ? true : false
                                }
                            })
                        }
                    })
                    break;
                case 3:
                    getData = this.getData.map(item => {
                        return {
                            id: item.id,
                            name: item.name,
                            children: item.children && item.children.map(children => {
                                return {
                                    id: children.id,
                                    name: children.name,
                                    children: children.children && children.children.map(children2 => {
                                        var active = this.xuanz.split(',').indexOf(`${children2.id}`) !== -1 ? true : false;
                                        return {
                                            id: children2.id,
                                            name: children2.name,
                                            active: active
                                        }
                                    })
                                }
                            })
                        }
                    })
                    break;
            }
            this.getData = getData;
            this.result = this.__result();
            this.pActive();
        },
        /**
        * 获取城市数据
        * @params {levelNumber}  default1为省份 2为市区 3为县区 
        */
        __result(levelNumber) {
            const result = [];
            const resultIndex = [];
            const level = levelNumber ? levelNumber : this.config.level;

            switch (level) {
                case 1:
                    this.getData.map((item) => {
                        item.active ? result.push(item.name) && resultIndex.push(item.id) : ''
                    })
                    break;
                case 2:
                    this.getData.map((item) => {
                        // 如果没有下级
                        if (!item.children) {
                            // item.active ? result.push(item.name) : ''
                        } else {
                            item.children.map(item2 => {
                                item2.active ? result.push(item2.name) && resultIndex.push(item2.id) : ''
                            })
                        }
                    })
                    break;
                case 3:
                    this.getData.map((item) => {
                        // 如果没有下级
                        if (!item.children) {
                            // item.active ? result.push(item.name) : ''
                        } else {
                            item.children.map(item2 => {
                                if (!item2.children) {
                                    // item2.active ? result.push(item2.name) : ''
                                } else {
                                    item2.children.map(item3 => {
                                        if (!item3.children) {
                                            item3.active ? result.push(item3.name) && resultIndex.push(item3.id) : ''
                                        }
                                    })
                                }
                            })
                        }
                    })
                    break;
                default:
                    break;
            }
            this.xuanz = resultIndex.join(',');
            return result;
        },
        // 展开
        showChildren(item) {
            this.$set(item, 'show', !item.show)
        },
        // 选择
        choose(item, pActive, cActive) {
            const that = this;
            const active = !item.active;
            const multiple = this.config.multiple;
            const level = this.config.level;
            // 单选
            if (multiple === 1) {
                console.log(level === 3 && !cActive)
                if ((level === 2 && !pActive) || (level === 3 && !cActive)) {
                    return;
                }

                this.diguiChoose2(this.getData, false);
                this.$set(item, 'active', active);

                this.pActive();
                this.result = this.__result();
                console.log(`选中的值 ${this.result}`);
                console.log(`选中的ID ${this.xuanz}`);
                return;
            }

            this.diguiChoose(item, active)
            this.$nextTick(() => {
                // 如果取消选中 那么上一个值为未选中
                if (active === false) {
                    pActive ? pActive.active = false : null;
                    cActive ? cActive.active = false : null;

                } else if (active === true) {
                    // 向上遍历
                    cActive && cActive.children.every((data) => {
                        return data.active;
                    }) ? this.$set(cActive, 'active', true) : null

                    pActive && pActive.children.every((data) => {
                        return data.active;
                    }) ? this.$set(pActive, 'active', true) : null
                }

                this.pActive();
                that.result = this.__result();
                console.log(`选中的值 ${this.result}`);
                console.log(`选中的ID ${this.xuanz}`);
            })
        },

        // 父类变色
        pActive() {
            this.getData.map((pActive) => {
                pActive.children && pActive.children.map((cActive) => {
                    let cactive = false;
                    cActive.children && cActive.children.some((data) => {
                        return data.active;
                    }) ? this.$set(cActive, 'Hactive', true) : cActive && this.$set(cActive, 'Hactive', false)
                    cActive.children && cActive.children.every((data) => {
                        return data.active;
                    }) ? this.$set(cActive, 'active', true) : null
                });
                console.log(pActive)
                pActive.children && pActive.children.some((data) => {
                    return data.active || data.Hactive;
                }) ? this.$set(pActive, 'Hactive', true) : pActive && this.$set(pActive, 'Hactive', false)
                pActive.children && pActive.children.every((data) => {
                    return data.active;
                }) ? this.$set(pActive, 'active', true) : pActive && null
            })
        },

        // [131,132]
        // 递归选择
        diguiChoose(data, active) {
            const that = this;
            this.$set(data, 'active', active)
            data.children && data.children.forEach((item) => {
                that.$set(item, 'active', active)
                that.diguiChoose(item, active);
            });
        },
        diguiChoose2(data, active) {
            const that = this;

            data.forEach(item => {
                this.$set(item, 'active', active)
                that.diguiChoose(item, active);
            })
        },
        showComponent() {
            this.cityComponent = !this.cityComponent
        }

    },
    template: `        <div class="list" :style="'height:' + config.height" v-show="cityComponent">
    <div class="item" v-for="(provincial, pkey) of getData" :key="provincial.id">
        <div class="frist">
            <div v-if="config.multiple === 1 && config.level !== 1" :class="provincial.show ? 'onopen':'open'"
                @click="showChildren(provincial)"></div>
            <div v-if="config.multiple === 0 && (config.level === 2 || config.level === 3)" :class="provincial.show ? 'onopen':'open'"
                @click="showChildren(provincial)"></div>
            <template v-if="config.multiple === 1">
                <i v-if="config.level === 2 || config.level === 3" :class="provincial.show ? 'iconfont icon-wenjianopen icon':'iconfont icon-wenjianoff icon'"></i>
                <div v-else class="choose" :style="provincial.active ? 'background:' + config.active : ''"
                    @click="choose(provincial)"></div>
            </template>
            <template v-else>
                <div class="choose" :style="provincial.active ? 'background:' + config.active : ''" @click="choose(provincial)"></div>
            </template>
            <div class="name" :style="provincial.Hactive ? 'color:' + config.Hactive : ''" @click="choose(provincial)">{{
                provincial.name }}</div>
        </div>
        <div v-show="provincial.show" class="children" v-for="(city, ckey) of provincial.children" :key="city.id">
            <div class="item">
                <div class="frist">
                    <div v-if="city.children" :class="city.show ? 'onopen':'open'" @click="showChildren(city)"></div>
                    <template v-if="config.multiple === 1">
                        <i v-if="config.level !== 2" :class="city.show ? 'iconfont icon-wenjianopen icon':'iconfont icon-wenjianoff icon'"></i>
                        <div v-else class="choose" :style="city.active ? 'background:' + config.active : ''"
                            @click="choose(city, provincial)"></div>
                    </template>
                    <template v-else>
                        <div class="choose" :style="city.active ? 'background:' + config.active : ''" @click="choose(city, provincial)"></div>
                    </template>
                    <div class="name" :style="city.Hactive ? 'color:' + config.Hactive : ''" @click="choose(city, provincial)">{{
                        city.name }}</div>
                </div>
                <div v-show="city.show" class="children" v-for="(area, akey) of city.children" :key="area.id">
                    <div class="item">
                        <div class="frist">
                            <div class="choose" :style="area.active ? 'background:' + config.active : ''"
                                @click="choose(area, provincial, city)"></div>
                            <div class="name" @click="choose(area, provincial, city)">{{ area.name }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`,
    mounted() {
        this.init();
    },
}
var app = new Vue({
    el: '#city',
    components: {
        City: CityC
    },
})

var city = app.$children[0];
