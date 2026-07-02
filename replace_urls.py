import json

file_path = r'd:\campus-market-seed\campus-market-seed\db.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

replace_count = 0

trades_map = {
    "1": "https://picsum.photos/seed/math-textbook/400/400",
    "2": "https://picsum.photos/seed/ipad-tablet/400/400",
    "3": "https://picsum.photos/seed/mountain-bike/400/400",
    "4": "https://picsum.photos/seed/dorm-desk/400/400",
    "5": "https://picsum.photos/seed/white-sneakers/400/400",
    "6": "https://picsum.photos/seed/fitness-tracker/400/400",
    "7": "https://picsum.photos/seed/electric-kettle/400/400",
    "8": "https://picsum.photos/seed/black-backpack/400/400",
}

lostFounds_map = {
    "1": "https://picsum.photos/seed/lost-backpack/400/300",
    "2": "https://picsum.photos/seed/student-id-card/400/300",
    "3": "https://picsum.photos/seed/wireless-earbuds/400/300",
    "4": "https://picsum.photos/seed/keychain-keys/400/300",
    "5": "https://picsum.photos/seed/student-card/400/300",
    "6": "https://picsum.photos/seed/blue-umbrella/400/300",
}

groupBuys_map = {
    "1": "https://picsum.photos/seed/bubble-milktea/400/300",
    "2": "https://picsum.photos/seed/fast-food-meal/400/300",
    "3": "https://picsum.photos/seed/library-study/400/300",
    "4": "https://picsum.photos/seed/badminton-sport/400/300",
    "5": "https://picsum.photos/seed/coffee-cup/400/300",
    "6": "https://picsum.photos/seed/exam-study/400/300",
    "7": "https://picsum.photos/seed/gym-fitness/400/300",
    "8": "https://picsum.photos/seed/hotpot-dinner/400/300",
}

errands_map = {
    "1": "https://picsum.photos/seed/parcel-delivery/400/300",
    "2": "https://picsum.photos/seed/boba-tea/400/300",
    "3": "https://picsum.photos/seed/printer-paper/400/300",
    "4": "https://picsum.photos/seed/shipping-box/400/300",
    "5": "https://picsum.photos/seed/office-form/400/300",
    "6": "https://picsum.photos/seed/chicken-rice/400/300",
    "7": "https://picsum.photos/seed/package-locker/400/300",
    "8": "https://picsum.photos/seed/english-textbook/400/300",
}

for item in data['trades']:
    if item['id'] in trades_map and 'trae-api-cn.mchost.guru' in item.get('image', ''):
        item['image'] = trades_map[item['id']]
        replace_count += 1

for item in data['lostFounds']:
    if item['id'] in lostFounds_map and 'trae-api-cn.mchost.guru' in item.get('image', ''):
        item['image'] = lostFounds_map[item['id']]
        replace_count += 1

for item in data['groupBuys']:
    if item['id'] in groupBuys_map and 'trae-api-cn.mchost.guru' in item.get('image', ''):
        item['image'] = groupBuys_map[item['id']]
        replace_count += 1

for item in data['errands']:
    if item['id'] in errands_map and 'trae-api-cn.mchost.guru' in item.get('image', ''):
        item['image'] = errands_map[item['id']]
        replace_count += 1

favorites_trade_map = {
    "1": trades_map["1"],
    "2": trades_map["2"],
    "3": trades_map["5"],
}
favorites_groupBuy_map = {
    "5": groupBuys_map["1"],
}
favorites_errand_map = {
    "6": errands_map["1"],
}

for item in data['favorites']:
    if 'trae-api-cn.mchost.guru' in item.get('image', ''):
        if item['itemType'] == 'trade' and item['id'] in favorites_trade_map:
            item['image'] = favorites_trade_map[item['id']]
            replace_count += 1
        elif item['itemType'] == 'groupBuy' and item['id'] in favorites_groupBuy_map:
            item['image'] = favorites_groupBuy_map[item['id']]
            replace_count += 1
        elif item['itemType'] == 'errand' and item['id'] in favorites_errand_map:
            item['image'] = favorites_errand_map[item['id']]
            replace_count += 1

conversations_map = {
    "1": trades_map["2"],
    "2": trades_map["5"],
    "3": lostFounds_map["1"],
    "4": errands_map["1"],
}

for item in data['conversations']:
    if item['id'] in conversations_map and ('trae-api-cn.mchost.guru' in item.get('itemImage', '') or 'picsum.photos/seed/https' in item.get('itemImage', '')):
        item['itemImage'] = conversations_map[item['id']]
        replace_count += 1

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

picsum_count = 0
for key in ['trades', 'lostFounds', 'groupBuys', 'errands', 'favorites']:
    for item in data[key]:
        if 'picsum.photos' in item.get('image', ''):
            picsum_count += 1
for item in data['conversations']:
    if 'picsum.photos' in item.get('itemImage', ''):
        picsum_count += 1

print(f"替换完成！共替换了 {replace_count} 条 URL")
print(f"验证：当前 picsum.photos URL 总数为 {picsum_count} 条")
